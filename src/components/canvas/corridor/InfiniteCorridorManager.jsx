import { useState, useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import CorridorSegment, { SEGMENT_LENGTH } from './CorridorSegment';

/**
 * Wrapper to toggle segment visibility based on camera position.
 * Massively reduces Draw Calls by hiding segments fully behind the camera.
 */
const SegmentVisibilityWrapper = ({ children, segmentIndex }) => {
    const groupRef = useRef();
    const { camera } = useThree();

    // Z bounds for this segment
    // Segment 0: Z=10 to Z=-70
    // Segment 1: Z=-70 to Z=-150
    const startZ = 10 - (segmentIndex * SEGMENT_LENGTH);
    const endZ = startZ - SEGMENT_LENGTH;

    useFrame(() => {
        if (!groupRef.current) return;
        // Camera looks towards -Z. 
        // If camera is significantly "in front" of the segment (e.g., camera Z is much less than endZ), hide it.
        // We reduce the buffer from 20 to 5. Once we pass the segment by 5 units, it disappears, freeing CPU.
        const isBehindCamera = camera.position.z < endZ - 5;
        // If camera is significantly "behind" the segment (e.g., camera Z is much greater than startZ + buffer), hide it.
        const isFarAhead = camera.position.z > startZ + 30;

        const isVisible = !(isBehindCamera || isFarAhead);

        if (groupRef.current.visible !== isVisible) {
            groupRef.current.visible = isVisible;
        }
    });

    return (
        <group ref={groupRef}>
            {children}
        </group>
    );
};

/**
 * InfiniteCorridorManager Component
 * 
 * Manages dynamic generation/removal of corridor segments.
 * 
 * hideDoorsForSegments: Array of segment indices that should hide their SegmentDoors
 * (used during entrance to avoid duplicate doors while keeping content preloaded)
 */
const InfiniteCorridorManager = ({
    onDoorEnter,
    hideDoorsForSegments = [], // Segments that should hide their SegmentDoors
    clipSegmentNeg1 = false, // Whether to clip segment -1 at EntranceDoors
    setCameraOverride // Function to take over camera control
}) => {
    const { camera } = useThree();
    // Pre-mount segments 0 and 1 so shaders compile during preloader.
    // Segment -1 is NOT pre-mounted to avoid visual collision with entrance doors.
    // It mounts dynamically when camera reaches entrance (behind camera = invisible stutter).
    const [activeSegments, setActiveSegments] = useState([0, 1]);

    // Calculate which segment the camera is in
    const getSegmentFromZ = useCallback((z) => {
        return Math.floor((10 - z) / SEGMENT_LENGTH);
    }, []);

    // Update active segments based on camera position
    useFrame(() => {
        const currentSegment = getSegmentFromZ(camera.position.z);

        // Render previous, current, and next segment
        const shouldBeActive = [
            currentSegment - 1,
            currentSegment,
            currentSegment + 1
        ];

        // Check if we need to update
        const needsUpdate = shouldBeActive.some(seg => !activeSegments.includes(seg)) ||
            activeSegments.some(seg => !shouldBeActive.includes(seg));

        if (needsUpdate) {
            setActiveSegments(shouldBeActive);
        }
    });

    return (
        <group>
            {activeSegments.map((segmentIndex) => (
                <SegmentVisibilityWrapper key={`seg-wrap-${segmentIndex}`} segmentIndex={segmentIndex}>
                    <CorridorSegment
                        key={`segment-${segmentIndex}`}
                        segmentIndex={segmentIndex}
                        onDoorEnter={onDoorEnter}
                        hideSegmentDoors={hideDoorsForSegments.includes(segmentIndex)}
                        zClip={clipSegmentNeg1 && segmentIndex === -1 ? 22 : 100000}
                        setCameraOverride={setCameraOverride}
                    />
                </SegmentVisibilityWrapper>
            ))}
        </group>
    );
};

export default InfiniteCorridorManager;

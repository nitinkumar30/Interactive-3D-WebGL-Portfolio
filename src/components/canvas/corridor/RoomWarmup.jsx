import { useRef, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Eagerly import all room components
import GalleryRoom from '../rooms/Gallery/GalleryRoom';
import StudioRoom from '../rooms/Studio/StudioRoom';
import AboutRoom from '../rooms/About/AboutRoom';
import ContactRoom from '../rooms/Contact/ContactRoom';

/**
 * RoomWarmup Component
 * 
 * Mounts all 4 rooms off-screen during the preloader phase to force
 * shader compilation and texture upload to GPU. After a few frames,
 * it unmounts the rooms to free memory. This ensures the first room
 * entry has zero shader compilation stutter.
 * 
 * Positioned 500 units below the scene so nothing is visible.
 * Audio components won't be audible at this distance.
 */
const RoomWarmup = ({ onWarmupComplete }) => {
    const [isDone, setIsDone] = useState(false);
    const frameCount = useRef(0);
    const completeFired = useRef(false);
    const { gl, scene, camera } = useThree();

    // Wait for rooms to render a few frames, then compile and unmount
    useFrame(() => {
        if (isDone || completeFired.current) return;

        frameCount.current++;

        // Wait 8 frames for all rooms to mount and render their meshes/textures
        if (frameCount.current >= 8) {
            completeFired.current = true;

            const finishWarmup = () => {
                requestAnimationFrame(() => {
                    setIsDone(true);
                    onWarmupComplete?.();
                });
            };

            // Force compile all shaders in the scene (including warm-up rooms)
            // Use 2026 compileAsync to avoid blocking the main thread!
            if (gl.compileAsync) {
                gl.compileAsync(scene, camera, scene)
                    .then(finishWarmup)
                    .catch((err) => {
                        console.error('Async compilation failed, falling back to sync', err);
                        gl.compile(scene, camera);
                        finishWarmup();
                    });
            } else {
                gl.compile(scene, camera);
                finishWarmup();
            }
        }
    });

    if (isDone) return null;

    // Dummy handlers to prevent errors (rooms expect these props)
    const noop = () => {};

    return (
        <group position={[0, -500, 0]}>
            {/* Mount all rooms in Suspense - positioned far below camera */}
            <Suspense fallback={null}>
                <group position={[-20, 0, 0]}>
                    <GalleryRoom showRoom={true} onReady={noop} isExiting={false} />
                </group>
            </Suspense>
            <Suspense fallback={null}>
                <group position={[20, 0, 0]}>
                    <StudioRoom showRoom={true} onReady={noop} isExiting={false} />
                </group>
            </Suspense>
            <Suspense fallback={null}>
                <group position={[-20, 0, -50]}>
                    <AboutRoom showRoom={true} onReady={noop} isExiting={false} />
                </group>
            </Suspense>
            <Suspense fallback={null}>
                <group position={[20, 0, -50]}>
                    <ContactRoom showRoom={true} onReady={noop} isExiting={false} />
                </group>
            </Suspense>
        </group>
    );
};

export default RoomWarmup;

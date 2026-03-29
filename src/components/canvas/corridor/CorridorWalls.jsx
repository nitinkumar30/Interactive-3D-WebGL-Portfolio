import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

// Import constants to match CorridorSegment logic
// Note: In a real project these might be in a shared config file.
// For now, we duplicate the values to avoid circular dependencies or complex imports if check is not rigorous.
const WALL_X_OUTER = 3.5;
const WALL_X_INNER = 1.7;
// Note: DOOR_Z_SPAN = 4 (from CorridorSegment)

/**
 * DoorWallSegment - Dynamic wall segment that tilts towards camera
 * Used for the angled walls next to doors
 */
const DoorWallSegment = ({ position, baseRotationY, width, corridorHeight, wallTexture, side }) => {
    const meshRef = useRef();
    const { camera } = useThree();

    // Tilt state
    const currentTilt = useRef(0);

    // Tilt parameters - adjust these to change the effect
    const BASE_TILT = 0.02;   // ~1 degree base tilt
    const MAX_TILT = 0.20;    // ~12 degrees max tilt when camera is close
    const TILT_START = 12;    // Start tilting when camera is 12 units away
    const TILT_PEAK = 2;      // Max tilt at 2 units

    useFrame(() => {
        if (!meshRef.current) return;

        const distance = Math.abs(camera.position.z - position[2]);
        let targetTilt = BASE_TILT;

        if (distance < TILT_START && distance > TILT_PEAK) {
            // Approaching: ramp up tilt
            const t = (TILT_START - distance) / (TILT_START - TILT_PEAK);
            const easedT = t * (2 - t); // easeOutQuad
            targetTilt = BASE_TILT + (MAX_TILT - BASE_TILT) * easedT;
        } else if (distance <= TILT_PEAK) {
            // Very close: max tilt
            targetTilt = MAX_TILT;
        }

        // Smooth interpolation
        currentTilt.current = THREE.MathUtils.lerp(currentTilt.current, targetTilt, 0.06);

        // Apply tilt - direction based on side
        const tiltDirection = side === 'left' ? -1 : 1;
        meshRef.current.rotation.y = baseRotationY + (currentTilt.current * tiltDirection);
    });

    // Clone texture for independent repeat
    const segTexture = useMemo(() => {
        const tex = wallTexture.clone();
        tex.needsUpdate = true;
        tex.repeat.set(width / 2, corridorHeight / 2);
        return tex;
    }, [wallTexture, width, corridorHeight]);

    return (
        <mesh ref={meshRef} position={position}>
            <planeGeometry args={[width, corridorHeight]} />
            <meshBasicMaterial color="#e0e0e0" map={segTexture} roughness={1} metalness={0} />
        </mesh>
    );
};

/**
 * CorridorWalls Component
 * 
 * Renders the floor, ceiling, and the Sawtooth Walls.
 * 
 * @param {Array} doorPositions - Array of door objects with { relativeZ, side, ... }
 * @param {number} zClip - Optional Z value to clip geometry (hide anything with Z > zClip)
 */
const CorridorWalls = ({ zStart = 10, length = 80, doorPositions = [], zClip = 100000 }) => {
    const corridorHeight = 3.5;

    // =============================================
    // USTAWIENIA PODŁOGI (FLOOR SETTINGS)
    // =============================================
    // Tekstura kawałka podłogi - ręcznie rysowane deski
    const floorTexture = useTexture('/textures/corridor/kawalekpodlogi.webp');
    floorTexture.wrapS = floorTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Tekstura listwy przypodłogowej (baseboards)
    // Wymiary obrazka: 1582 x 94 px → aspect ratio 16.83:1
    const baseboardTexture = useTexture('/textures/corridor/texturadoprogow.webp');
    baseboardTexture.wrapS = baseboardTexture.wrapT = THREE.RepeatWrapping;
    baseboardTexture.colorSpace = THREE.SRGBColorSpace;

    // Load wall texture
    const wallTexture = useTexture('/textures/corridor/wall_texture.webp');
    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;

    // Load ceiling texture
    const ceilingTexture = useTexture('/textures/corridor/ceiling_texture.webp');
    ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;

    // Calculate effective geometry based on clipping
    // We only render from Math.min(zStart, zClip) down to (zStart - length)
    const effectiveStart = Math.min(zStart, zClip);
    const effectiveLength = effectiveStart - (zStart - length);
    const zCenter = effectiveStart - effectiveLength / 2;

    // If fully clipped, render nothing
    if (effectiveLength <= 0) return null;

    // =============================================
    // REGULACJA PRZYCIĘCIA LISTWY PRZY DRZWIACH
    // =============================================
    // O ile (w unitach 3D) skrócić listwę z każdej strony przy ramce drzwi.
    // Zwiększ wartość → większa przerwa między listwą a drzwiami.
    // Zmniejsz wartość → listwa bliżej drzwi (może najeżdżać na ramkę).
    const BASEBOARD_DOOR_MARGIN = 0.5;

    // Helper to generate wall segments for a side ('left' or 'right')
    const generateWallSegments = (side) => {
        const segments = [];
        const isLeft = side === 'left';
        const baseX = isLeft ? -WALL_X_OUTER : WALL_X_OUTER;
        const innerX = isLeft ? -WALL_X_INNER : WALL_X_INNER;

        // We build the wall from Start (High Z) to End (Low Z).
        // Current 'cursor' for Z
        let currentZ = effectiveStart;
        const endZ = effectiveStart - effectiveLength;

        // Sort doors by relativeZ descending (closest to start first) if needed
        // relativeZ is negative (-18, -32...). -18 > -32.
        const sideDoors = doorPositions
            .filter(d => d.side === side)
            .sort((a, b) => b.relativeZ - a.relativeZ);

        sideDoors.forEach(door => {
            const doorZ = zStart + door.relativeZ; // Use original zStart for correct world position
            const doorStartZ = doorZ + 2.0; // Start of angled section
            const doorEndZ = doorZ - 2.0;   // End of angled section

            // Skip doors that are completely clipped (starts "behind" us)
            if (doorStartZ > currentZ) return;
            // Also skip if door is fully "ahead" of us (shouldn't happen with standard logic but safe)
            if (doorEndZ < endZ) return;

            // 1. Straight Filler Segment (from currentZ to doorStartZ)
            if (currentZ > doorStartZ) {
                const segLength = currentZ - doorStartZ;
                const segCenterZ = currentZ - segLength / 2;
                segments.push({
                    type: 'filler',
                    position: [baseX, 0, segCenterZ],
                    rotation: [0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0],
                    width: segLength,
                    isLeft,
                    // Ten segment kończy się przy drzwiach (od strony niższego Z)
                    trimLowZ: true
                });
            }

            // 2. Connector (Step Out) - The wall that faces the camera
            // Wait, if we are at baseX (Outer), and we want to start angled wall?
            // Actually, the angled wall GOES from Outer to Inner.
            // So we are rightfully at Outer.
            // Wait, the "Filler" is at Outer (Recessed).
            // So we are already at the start point of the angled wall.
            // No connector needed BEFORE the door?
            // Let's trace Left Wall (-X):
            // Filler is at x = -3.5.
            // Angled wall starts at x = -3.5.
            // Angled wall ends at x = -1.7.
            // So continuous join. Good.

            // 3. Angled Wall (Door holder)
            // From (baseX, doorStartZ) to (innerX, doorEndZ).
            const dx = innerX - baseX;
            const dz = doorEndZ - doorStartZ; // Negative (-4)
            const dist = Math.sqrt(dx * dx + dz * dz);
            const angle = Math.atan2(dx, dz); // Angle relative to Z axis?
            // atan2(dx, dz). Left: dx = 1.8, dz = -4. Angle ~ 155 deg.
            // Standard wall normal is 90 deg.
            // We want rotation around Y.
            // Center of segment:
            const midX = (baseX + innerX) / 2;
            const midZ = (doorStartZ + doorEndZ) / 2;

            // Rotation:
            // Plane defaults to facing +Z (if simple plane)? No planeGeometry defaults to XY plane.
            // LookAt approach is easiest.
            // Wall normal should point inwards?
            // Actually simpler: Position geometry center and rotate.
            // Vector from Start to End: (dx, 0, dz).
            // Rotation Y = -atan2(dz, dx).
            // Left: dx=1.8, dz=-4. atan2(-4, 1.8) = -1.14 rad ~ -65 deg.
            // -(-65) = 65 deg.
            // Check: 0 deg = +X alignment. 90 deg = -Z alignment.
            // 65 deg = Pointing mostly +X, slightly -Z.
            // This aligns with vector.
            // Normal is +90 deg from that?
            // Left: dx=1.8, dz=-4. atan2(-4, 1.8) = -1.14 rad. -(-1.14) = +1.14. 
            // Normal (+0.9, +0.4) -> Right/Back. Correct for Left Wall.
            // Right: dx=-1.8, dz=-4. atan2(-4, -1.8) = -1.9 rad (-110deg). -(-1.9) = +1.9. 
            // Normal (+0.3, -0.9)? No. Check Math.
            // We need Right Wall Normal to point (-X, +Z). 
            // Adding PI fixes the backface issue.

            const baseRotation = -Math.atan2(dz, dx);
            const finalRotation = isLeft ? baseRotation : baseRotation + Math.PI;

            segments.push({
                type: 'door',
                position: [midX, 0, midZ],
                rotationY: finalRotation,
                width: dist,
                side: side  // For dynamic tilt direction
            });

            // 4. Reset Connector (The hidden face)
            // We are now at (innerX, doorEndZ).
            // We need to return to (baseX, doorEndZ).
            // Or (baseX, doorEndZ - eps).
            // This is a straight wall segment facing AWAY (-Z direction).
            // Left: From -1.7 to -3.5. Vector (-1.8, 0).
            // Facing -Z? Normal should be -Z.
            // Only need to render it.
            const connWidth = Math.abs(baseX - innerX);
            const connX = (innerX + baseX) / 2;

            segments.push({
                type: 'connector',
                position: [connX, 0, doorEndZ],
                rotation: [0, 0, 0], // Plane facing +Z.
                // If Face +Z, and we view from +Z, we see it.
                // We want it facing -Z (Away).
                // So Rotation Y = PI.
                rotationY: Math.PI,
                width: connWidth
            });

            currentZ = doorEndZ;
        });

        // Final filler segment
        if (currentZ > endZ) {
            const segLength = currentZ - endZ;
            const segCenterZ = currentZ - segLength / 2;
            segments.push({
                type: 'filler',
                position: [baseX, 0, segCenterZ],
                rotation: [0, isLeft ? Math.PI / 2 : -Math.PI / 2, 0],
                width: segLength,
                isLeft,
                // Ten segment zaczyna się zaraz po drzwiach (od strony wyższego Z)
                trimHighZ: currentZ !== effectiveStart
            });
        }

        return segments;
    };

    const leftSegments = useMemo(() => generateWallSegments('left'), [effectiveStart, effectiveLength, doorPositions]);
    const rightSegments = useMemo(() => generateWallSegments('right'), [effectiveStart, effectiveLength, doorPositions]);

    return (
        <group>
            {/* =============================================
                PODŁOGA - Kafelki (FLOOR TILES)
                =============================================
                Każdy kafelek jest płaskim plane z teksturą kawalekpodlogi.png
                Co drugi kafelek jest obrócony o 180° i lustrzanie odbity
                żeby fajnie się łączyły ze sobą.
                
                USTAWIENIA DO RĘCZNEJ REGULACJI:
                - TILE_LENGTH: długość jednego kafelka (w unitach 3D)
                - TILE_WIDTH: szerokość (powinna pasować do korytarza = 7)
                - FLOOR_START_OFFSET: przesunięcie startu podłogi
            */}
            {(() => {
                // ===== REGULACJA KAFELKÓW PODŁOGI =====
                const TILE_LENGTH = 10;          // Długość jednego kafelka wzdłuż korytarza
                const CENTER_WIDTH = 5;          // Szerokość środkowego pasa (węższe deski = ładniej)
                const SIDE_WIDTH = 1;            // Szerokość bocznych pasów po lewej i prawej
                const FLOOR_START_OFFSET = 2;    // Offset startu (+ = dalej, - = bliżej kamery)

                // Przycięte tekstury do bocznych pasów (ta sama skala co środek, nie rozciągnięte!)
                // UV repeat = jaki ułamek tekstury pokazać (SIDE_WIDTH / CENTER_WIDTH)
                const uvFraction = SIDE_WIDTH / CENTER_WIDTH; // np. 1/5 = 0.2 → 20% tekstury

                const leftSideTexture = floorTexture.clone();
                leftSideTexture.needsUpdate = true;
                leftSideTexture.repeat.set(1, uvFraction);    // Pełna długość, przycięta szerokość
                leftSideTexture.offset.set(0, 0);             // Lewa krawędź tekstury

                const rightSideTexture = floorTexture.clone();
                rightSideTexture.needsUpdate = true;
                rightSideTexture.repeat.set(1, uvFraction);
                rightSideTexture.offset.set(0, 1 - uvFraction); // Prawa krawędź tekstury

                const tiles = [];
                const floorY = -corridorHeight / 2;
                const segmentEndZ = effectiveStart - effectiveLength;

                const firstTileIndex = Math.floor(effectiveStart / TILE_LENGTH);
                let tileZ = firstTileIndex * TILE_LENGTH - TILE_LENGTH / 2 + FLOOR_START_OFFSET;

                while (tileZ + TILE_LENGTH / 2 > segmentEndZ) {
                    const globalTileIndex = Math.round(tileZ / TILE_LENGTH);
                    const isMirrored = Math.abs(globalTileIndex) % 2 === 1;

                    // --- Środkowy pas podłogi ---
                    tiles.push(
                        <mesh
                            key={`floor-center-${tileZ.toFixed(1)}`}
                            position={[0, floorY, tileZ]}
                            rotation={[-Math.PI / 2, 0, Math.PI / 2 + (isMirrored ? Math.PI : 0)]}
                            scale={[isMirrored ? -1 : 1, 1, 1]}
                        >
                            <planeGeometry args={[TILE_LENGTH, CENTER_WIDTH]} />
                            <meshBasicMaterial color="#e0e0e0"
                                map={floorTexture}
                                side={THREE.DoubleSide}
                                roughness={1}
                                metalness={0}
                            />
                        </mesh>
                    );

                    // --- Lewy pas podłogi (przycięta tekstura, nie rozciągnięta!) ---
                    tiles.push(
                        <mesh
                            key={`floor-left-${tileZ.toFixed(1)}`}
                            position={[-(CENTER_WIDTH / 2 + SIDE_WIDTH / 2), floorY, tileZ]}
                            rotation={[-Math.PI / 2, 0, Math.PI / 2 + (isMirrored ? Math.PI : 0)]}
                            scale={[isMirrored ? -1 : 1, 1, 1]}
                        >
                            <planeGeometry args={[TILE_LENGTH, SIDE_WIDTH]} />
                            <meshBasicMaterial color="#e0e0e0"
                                map={leftSideTexture}
                                side={THREE.DoubleSide}
                                roughness={1}
                                metalness={0}
                            />
                        </mesh>
                    );

                    // --- Prawy pas podłogi (przycięta tekstura, nie rozciągnięta!) ---
                    tiles.push(
                        <mesh
                            key={`floor-right-${tileZ.toFixed(1)}`}
                            position={[(CENTER_WIDTH / 2 + SIDE_WIDTH / 2), floorY, tileZ]}
                            rotation={[-Math.PI / 2, 0, Math.PI / 2 + (isMirrored ? Math.PI : 0)]}
                            scale={[isMirrored ? -1 : 1, 1, 1]}
                        >
                            <planeGeometry args={[TILE_LENGTH, SIDE_WIDTH]} />
                            <meshBasicMaterial color="#e0e0e0"
                                map={rightSideTexture}
                                side={THREE.DoubleSide}
                                roughness={1}
                                metalness={0}
                            />
                        </mesh>
                    );

                    tileZ -= TILE_LENGTH;
                }
                return tiles;
            })()}


            {/* Ceiling with texture - alternating tiles for seamless pattern */}
            {(() => {
                const tileLength = 10; // Match floor tile length
                const tileWidth = 7;   // Ceiling width (matching corridor)
                const tiles = [];
                const ceilingY = corridorHeight / 2;

                // Use same global Z alignment as floor
                const segmentEndZ = effectiveStart - effectiveLength;

                // First tile position with fine-tuned offset (same as floor)
                const CEILING_START_OFFSET = 2; // Match floor offset
                const firstTileIndex = Math.floor(effectiveStart / tileLength);
                let tileZ = firstTileIndex * tileLength - tileLength / 2 + CEILING_START_OFFSET;

                while (tileZ + tileLength / 2 > segmentEndZ) {
                    // Use global tile index for alternating pattern
                    const globalTileIndex = Math.round(tileZ / tileLength);
                    const isMirrored = Math.abs(globalTileIndex) % 2 === 1;

                    tiles.push(
                        <mesh
                            key={`ceiling-tile-${tileZ.toFixed(1)}`}
                            position={[0, ceilingY, tileZ]}
                            rotation={[Math.PI / 2, 0, isMirrored ? Math.PI : 0]}
                            scale={[isMirrored ? -1 : 1, 1, 1]}
                        >
                            <planeGeometry args={[tileWidth, tileLength]} />
                            <meshBasicMaterial color="#e0e0e0"
                                map={ceilingTexture}
                                map-repeat={[tileWidth / 2, tileLength / 2]}
                                side={THREE.DoubleSide}
                                roughness={1}
                                metalness={0}
                            />
                        </mesh>
                    );
                    tileZ -= tileLength;
                }
                return tiles;
            })()}

            {/* Render Wall Segments with texture */}
            {/* Skip 'connector' and 'door' segments - door segments are now handled by DoorSection */}
            {[...leftSegments, ...rightSegments]
                .filter(seg => seg.type === 'filler')
                .map((seg, i) => {
                    // Wall texture clone (same pattern for wall + baseboard)
                    const segTexture = wallTexture.clone();
                    segTexture.needsUpdate = true;
                    segTexture.repeat.set(seg.width / 2, corridorHeight / 2);

                    // Baseboard texture clone
                    // Texture: 1582x94 px. Natural tile = (1582/94)*0.15 = 2.524 units wide
                    const bbTexture = baseboardTexture.clone();
                    bbTexture.needsUpdate = true;
                    bbTexture.wrapS = bbTexture.wrapT = THREE.RepeatWrapping;
                    bbTexture.rotation = 0; // CRITICAL: reset rotation (shared texture may have PI/2 from threshold)
                    bbTexture.offset.set(0, 0);
                    const NATURAL_TILE_W = (1582 / 94) * 0.15;
                    bbTexture.repeat.set(seg.width / NATURAL_TILE_W, 1);

                    // =============================================
                    // PRZYCINANIE LISTWY PRZY DRZWIACH
                    // =============================================
                    // Listwa jest węższa o BASEBOARD_DOOR_MARGIN z każdej strony
                    // gdzie segment sąsiaduje z drzwiami (trimStart / trimEnd).
                    // Środek listwy jest przesunięty, żeby wyrównać do ściany.
                    // trimHighZ = przytnij od strony wyższego Z (gdzie zaczyna się wnęka drzwi)
                    // trimLowZ  = przytnij od strony niższego Z  (gdzie kończy się wnęka drzwi)
                    const bbMarginHighZ = seg.trimHighZ ? BASEBOARD_DOOR_MARGIN : 0;
                    const bbMarginLowZ = seg.trimLowZ ? BASEBOARD_DOOR_MARGIN : 0;
                    const bbWidth = seg.width - bbMarginHighZ - bbMarginLowZ;

                    // Przesunięcie środka listwy wzdłuż osi lokalnej (X w przestrzeni grupy)
                    // Segment jest obrócony, więc lokalna oś X = wzdłuż ściany.
                    // Po rotacji +PI/2 (lewa ściana): lokalna oś +X → świat -Z (niższy Z)
                    // Po rotacji -PI/2 (prawa ściana): lokalna oś +X → świat +Z (wyższy Z)
                    // Dlatego offset jest odwrócony między lewą a prawą ścianą.
                    let bbOffsetX;
                    if (seg.isLeft) {
                        // +X lokalny = -Z świat = strona lowZ
                        bbOffsetX = (bbMarginLowZ - bbMarginHighZ) / 2;
                    } else {
                        // +X lokalny = +Z świat = strona highZ
                        bbOffsetX = (bbMarginHighZ - bbMarginLowZ) / 2;
                    }

                    return (
                        <group key={i} position={seg.position} rotation={seg.rotation || [0, seg.rotationY, 0]}>
                            {/* Main Wall Segment */}
                            <mesh>
                                <planeGeometry args={[seg.width, corridorHeight]} />
                                <meshBasicMaterial color="#e0e0e0"
                                    map={segTexture}
                                    roughness={1}
                                    metalness={0}
                                />
                            </mesh>

                            {/* Baseboard (Listwa przypodłogowa) - przycięta przy drzwiach */}
                            <mesh position={[bbOffsetX, -corridorHeight / 2 + 0.075, 0.01]}>
                                <planeGeometry args={[bbWidth, 0.15]} />
                                <meshBasicMaterial color="#e0e0e0"
                                    map={bbTexture}
                                    roughness={0.8}
                                    side={THREE.DoubleSide}
                                />
                            </mesh>
                        </group>
                    );
                })}



            {/* Baseboards (Approximated or skip for complex geo for now) */}
            {/* Simplified: Just skip baseboards on zigzag for MVP efficiency */}
        </group>
    );
};

export default CorridorWalls;

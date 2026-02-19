import { useMemo } from 'react';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';

/**
 * CorridorDecorations - Dekoracje korytarza.
 * 
 * Proste płaskie plane'y z teksturami - styl rysunkowy 2D w świecie 3D.
 * 
 * Korytarz (per segment, 80 units):
 *   Drzwi: relZ -18 (left), -32 (right), -48 (left), -62 (right)
 *   corridorWidth: ~3.5 per side
 *   corridorHeight: 3.5
 *   Bezpieczne strefy dekoracji: -5 do -15, -20 do -30, -34 do -46, -50 do -60, -64 do -75
 */

const CABIN_SKETCH_URL = '/fonts/CabinSketch-Regular.ttf';

const PictureContent = ({ imagePath, width, height }) => {
    const texture = useTexture(imagePath);
    return (
        <mesh position={[0, 0, 0.01]}> {/* Lekko przed ramką */}
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
                map={texture}
                transparent={true}
                alphaTest={0.1} // KLUCZOWE: Naprawia przezroczystość (wycina tło)
                side={THREE.DoubleSide}
                roughness={0.5}
            />
        </mesh>
    );
};

const CorridorDecorations = ({ segmentLength, zOffset, corridorWidth = 4, corridorHeight = 3.5, zClip = 100000 }) => {

    const wallX = corridorWidth / 2 - 0.01;
    const floorY = -corridorHeight / 2;
    const ceilingY = corridorHeight / 2;

    // =============================================
    // TEKSTURY DEKORACJI
    // =============================================
    const frameTexture = useTexture('/textures/corridor/ramka na zdjecie.png');
    const standingFrameTexture = useTexture('/textures/corridor/ramkanazdjecie.png');
    const treeTexture = useTexture('/textures/corridor/drzewkowdoniczce.png');
    const grateTexture = useTexture('/textures/corridor/kratkawentylacyjna.png');
    const flowerTexture = useTexture('/textures/corridor/kwiatekwdoniczce.png');

    // --- Ceiling Lights (punkty światła) ---
    // Tekstury lamp
    const lampGrilleTexture = useTexture('/textures/corridor/kratanalampy.png');
    // lampGrilleTexture.wrapS = lampGrilleTexture.wrapT = THREE.RepeatWrapping; 
    // lampGrilleTexture.repeat.set(1, 1);

    const lampSideTexture = useTexture('/textures/corridor/bokilampy.png');
    lampSideTexture.wrapS = lampSideTexture.wrapT = THREE.RepeatWrapping;
    // Dopasowanie UV dla długiego boku
    lampSideTexture.repeat.set(1, 1);

    const lights = useMemo(() => {
        const items = [];
        // ===== REGULACJA ŚWIATEŁ =====
        const LIGHT_SPACING = 15;      // Odstęp między lampami
        const LIGHT_START_OFFSET = -5;  // Start z zapasem od początku (bo tam są drzwi poprzedniego segmentu)

        const startZ = zOffset + LIGHT_START_OFFSET;
        const endZ = zOffset - segmentLength + 10; // Zapas od końca (SegmentDoors jest na -75)

        for (let z = startZ; z > endZ; z -= LIGHT_SPACING) {
            items.push({ z });
        }
        return items;
    }, [segmentLength, zOffset]);

    // =============================================
    // RAMKI NA ZDJĘCIA (PICTURE FRAMES)
    // =============================================
    // Płaskie plane'y na ścianach z teksturą ramki.
    // Wewnątrz ramki można później dodać plakaty/zdjęcia.
    //
    // USTAWIENIA DO RĘCZNEJ REGULACJI:
    // - z: pozycja Z (gdzie na osi korytarza), obliczana jako zOffset - wartość
    // - side: 'left' lub 'right'
    // - width/height: rozmiar ramki
    // - y: pozycja Y (wysokość na ścianie, 0 = środek)
    const frames = useMemo(() => [
        {
            z: zOffset - 10,         // Między startem a Gallery (relZ -5 do -15)
            side: 'right',
            width: 2.5,              // Szerokość ramki
            height: 1.5,             // Wysokość ramki  (proporcje jak tektura ~16:10)
            y: 0.3,                  // Wysokość na ścianie
            id: 'frame-1',
            // Custom setup for "rysuneknaobraz1.png"
            image: '/textures/corridor/rysuneknaobraz1.png',
            imageWidth: 1.1,
            imageHeight: 1.1,
            offsetFromWall: 0.1, // Przesunięcie bliżej środka korytarza (0.1 unit)

            // --- USTAWIENIA PODPISU (SIGNATURE SETTINGS) ---
            signature: 'Author: Dasza',
            // X: pozycja pozioma względem środka ramki (dodatnie = prawo, ujemne = lewo)
            signatureX: 0.7,
            // Y: pozycja pionowa względem środka ramki (dodatnie = góra, ujemne = dół)
            signatureY: -0.45,
            // Rozmiar czcionki
            signatureSize: 0.1,
            signatureColor: '#333333'
        },
        {
            z: zOffset - 25,         // Między Gallery a Studio (relZ -20 do -30)
            side: 'left',
            width: 2.5,
            height: 1.5,
            y: 0.2,
            id: 'frame-2',
        },
        {
            z: zOffset - 40,         // Między Studio a About (relZ -34 do -46)
            side: 'right',
            width: 2.5,
            height: 1.5,
            y: 0.25,
            id: 'frame-3',
        },
        {
            z: zOffset - 55,         // Między About a Connect (relZ -50 do -60)
            side: 'left',
            width: 2.5,
            height: 1.5,
            y: 0.35,
            id: 'frame-4',
        },
    ], [zOffset]);

    // =============================================
    // STOLIK (TABLE)
    // =============================================
    const woodTexture = useTexture('/textures/corridor/texturadrewnadonozekbiurka.png');
    const tableTopTexture = useTexture('/textures/corridor/gorastolika.png');

    // Tekstury szafki
    const cabinetFrontTexture = useTexture('/textures/corridor/szafkaprzod.png');
    const cabinetRestTexture = useTexture('/textures/corridor/szafkaprzodgora.png');

    // Klonujemy teksturę dla nóg, żeby ją obrócić (bo user mówi że jest poziomo a ma być pionowo)
    const legTexture = useMemo(() => {
        const tex = woodTexture.clone();
        tex.rotation = Math.PI / 2;
        tex.center.set(0.5, 0.5);
        return tex;
    }, [woodTexture]);

    // Konfiguracja stolika
    // Obrócony 90° i przyciągnięty do lewej ściany
    const tableConfig = useMemo(() => ({
        z: zOffset - 35,          // Pozycja Z (strefa między Studio a About)
        width: 2.0,               // Szerokość blatu (po obrocie: wzdłuż ściany)
        depth: 0.8,               // Głębokość blatu (po obrocie: od ściany w korytarz)
        height: 1.0,              // Wysokość całkowita
        legRadius: 0.08,          // Grubość nóg
        topThickness: 0.08,       // Grubość blatu
        x: -wallX + 0.42,         // Przy lewej ścianie (depth/2 + mały gap)
    }), [zOffset, wallX]);

    return (
        <group>
            {/* === LAMPY SUFITOWE === */}
            {lights.filter(light => light.z <= zClip).map((light, i) => {
                // Konfiguracja tekstur wewnątrz pętli (lub poza, ale upewnijmy się co do wrappingu)
                lampGrilleTexture.wrapS = lampGrilleTexture.wrapT = THREE.ClampToEdgeWrapping;
                lampSideTexture.wrapS = lampSideTexture.wrapT = THREE.ClampToEdgeWrapping; // Boki też clamp, żeby nie było pasków

                return (
                    <group key={`light-${i}`} position={[0, ceilingY, light.z]}>
                        {/* Obudowa lampy - podłużny prostokąt 3D */}
                        {/* GŁÓWNA BRYŁA */}
                        <mesh position={[0, -0.03, 0]}>
                            <boxGeometry args={[2.0, 0.06, 0.5]} />

                            {/* Short sides (Right/Left) */}
                            <meshStandardMaterial attach="material-0" color="#e8e8e8" roughness={0.6} />
                            <meshStandardMaterial attach="material-1" color="#e8e8e8" roughness={0.6} />

                            {/* Top (Hidden) */}
                            <meshStandardMaterial attach="material-2" color="#d0d0d0" roughness={0.8} />

                            {/* Bottom - Grille Texture 
                                Używamy przezroczystości, żeby odsłonić wewnętrzne światło.
                                Sama krata jest ciemna/metaliczna.
                            */}
                            <meshStandardMaterial
                                attach="material-3"
                                map={lampGrilleTexture}
                                transparent={true}
                                alphaTest={0.1}
                                side={THREE.DoubleSide}
                                color="#ffffff"
                                roughness={0.5}
                            />

                            {/* Long sides (Front/Back) - Side Texture */}
                            <meshStandardMaterial attach="material-4" map={lampSideTexture} roughness={0.6} />
                            <meshStandardMaterial attach="material-5" map={lampSideTexture} roughness={0.6} />
                        </mesh>

                        {/* WEWNĘTRZNE ŚWIATŁO (LIGHT PANEL) 
                            Siedzi WYŻEJ w obudowie, żeby kratka pod spodem była widoczna.
                        */}
                        <mesh
                            position={[0, -0.059, 0]}
                            rotation={[-Math.PI / 2, 0, 0]}
                        >
                            <planeGeometry args={[1.9, 0.4]} />
                            <meshBasicMaterial
                                color="#ffffffff"
                                toneMapped={false}
                                side={THREE.DoubleSide}
                            />
                        </mesh>

                        {/* RZECZYWISTE ŹRÓDŁO ŚWIATŁA (PointLight) */}
                        <pointLight
                            position={[0, -1.5, 0]}
                            distance={6}
                            intensity={0.8}
                            color="#ffffffff"
                            decay={2}
                        />
                    </group>
                );
            })}

            {/* === STOLIK (obrócony 90°, przy lewej ścianie) === */}
            <group position={[tableConfig.x, floorY, tableConfig.z]} rotation={[0, Math.PI / 2, 0]}>
                {/* Nogi stolika */}
                {[
                    [-tableConfig.width / 2 + 0.1, -tableConfig.depth / 2 + 0.1],
                    [tableConfig.width / 2 - 0.1, -tableConfig.depth / 2 + 0.1],
                    [-tableConfig.width / 2 + 0.1, tableConfig.depth / 2 - 0.1],
                    [tableConfig.width / 2 - 0.1, tableConfig.depth / 2 - 0.1],
                ].map((pos, i) => (
                    <mesh key={`leg-${i}`} position={[pos[0], tableConfig.height / 2, pos[1]]}>
                        <boxGeometry args={[tableConfig.legRadius * 2, tableConfig.height, tableConfig.legRadius * 2]} />
                        <meshStandardMaterial map={legTexture} roughness={0.8} />
                    </mesh>
                ))}

                {/* Blat stolika */}
                <mesh position={[0, tableConfig.height + tableConfig.topThickness / 2, 0]}>
                    <boxGeometry args={[tableConfig.width, tableConfig.topThickness, tableConfig.depth]} />
                    <meshStandardMaterial attach="material-0" map={woodTexture} /> {/* Right */}
                    <meshStandardMaterial attach="material-1" map={woodTexture} /> {/* Left */}
                    <meshStandardMaterial attach="material-2" map={tableTopTexture} roughness={0.5} /> {/* Top */}
                    <meshStandardMaterial attach="material-3" color="#ffffff" />   {/* Bottom */}
                    <meshStandardMaterial attach="material-4" map={woodTexture} /> {/* Front */}
                    <meshStandardMaterial attach="material-5" map={woodTexture} /> {/* Back */}
                </mesh>

                {/* KWIATEK W DONICZCE NA STOLE */}
                <mesh
                    position={[0, tableConfig.height + tableConfig.topThickness + 0.2, 0]} // Na blacie
                    rotation={[0, -Math.PI / 4, 0]} // Lekki obrót
                >
                    <planeGeometry args={[0.3, 0.4]} />
                    <meshStandardMaterial
                        map={flowerTexture}
                        transparent={true}
                        alphaTest={0.1}
                        side={THREE.DoubleSide}
                        roughness={0.8}
                    />
                </mesh>
            </group>

            {/* =============================================
                RAMKI NA ZDJĘCIA NA ŚCIANACH
                =============================================
                Każda ramka to płaski plane z teksturą "ramka na zdjecie.png".
                Są przyczepione do ścian na przemian (lewa/prawa).
                
                Żeby zmienić pozycję/rozmiar konkretnej ramki,
                edytuj odpowiedni obiekt w tablicy 'frames' powyżej.
            */}
            {frames.map((frame) => (
                <group
                    key={frame.id}
                    position={[
                        frame.side === 'left' ? -wallX + (frame.offsetFromWall || 0) : wallX - (frame.offsetFromWall || 0),
                        frame.y,
                        frame.z
                    ]}
                    rotation={[0, frame.side === 'left' ? Math.PI / 2 : -Math.PI / 2, 0]}
                >
                    {/* RAMKA */}
                    <mesh>
                        <planeGeometry args={[frame.width, frame.height]} />
                        <meshStandardMaterial
                            map={frameTexture}
                            transparent={true}
                            alphaTest={0.1}
                            side={THREE.DoubleSide}
                            roughness={0.9}
                        />
                    </mesh>

                    {/* OBRAZEK WEWNĄTRZ (opcjonalny) */}
                    {frame.image && (
                        <PictureContent
                            imagePath={frame.image}
                            width={frame.imageWidth || frame.width * 0.7}
                            height={frame.imageHeight || frame.height * 0.7}
                        />
                    )}

                    {/* PODPIS (opcjonalny) */}
                    {frame.signature && (
                        <Text
                            position={[
                                // Używamy customowych pozycji lub domyślnych (prawy dolny róg)
                                frame.signatureX !== undefined ? frame.signatureX : (frame.width / 2 - 0.1),
                                frame.signatureY !== undefined ? frame.signatureY : (-frame.height / 2 + 0.15),
                                0.02 // Slightly in front
                            ]}
                            fontSize={frame.signatureSize || 0.12}
                            font={CABIN_SKETCH_URL}
                            color={frame.signatureColor || "#333333"}
                            anchorX="center" // Zmieniam na center, żeby łatwiej pozycjonować X/Y
                            anchorY="middle"
                        >
                            {frame.signature}
                        </Text>
                    )}
                </group>
            ))}

            {/* === SZAFKA (CABINET) === */}
            {/* Prosty box jako placeholder, naprzeciwko drzwi About (Left -48) -> więc szafka na Right -51 */}
            <mesh
                position={[wallX - 0.26, floorY + 0.5, zOffset - 51]}
            // X: wallX - (depth/2) - mały margin
            // Y: floorY + (height/2)
            // Z: zOffset - 51 (blisko drzwi About)
            >
                {/* Wymiary: X=0.5 (głębokość od ściany), Y=1.0 (wysokość), Z=0.8 (szerokość wzdłuż ściany) */}
                <boxGeometry args={[0.5, 1.0, 0.8]} />
                {/* 
                    Materials for BoxGeometry:
                    0: Right (+x) - Wall side
                    1: Left (-x) - Corridor side (FRONT of cabinet) -> szafkaprzod.png
                    2: Top (+y) -> szafkaprzodgora.png
                    3: Bottom (-y) -> szafkaprzodgora.png (as requested)
                    4: Front (+z) -> szafkaprzodgora.png (side)
                    5: Back (-z) -> szafkaprzodgora.png (side)
                */}
                <meshStandardMaterial attach="material-0" map={cabinetRestTexture} />
                <meshStandardMaterial attach="material-1" map={cabinetFrontTexture} />
                <meshStandardMaterial attach="material-2" map={cabinetRestTexture} />
                <meshStandardMaterial attach="material-3" map={cabinetRestTexture} />
                <meshStandardMaterial attach="material-4" map={cabinetRestTexture} />
                <meshStandardMaterial attach="material-5" map={cabinetRestTexture} />
            </mesh>

            {/* === STOJĄCA RAMKA NA SZAFCE (STANDING FRAME) === */}
            {/* Stoi na szafce: Y = floorY + 1.0 (wysokość szafki) + połowa wysokości ramki */}
            <mesh
                position={[wallX - 0.26, floorY + 1.0 + 0.2, zOffset - 51]}
                rotation={[0, -Math.PI / 2 + 0.2, 0]} // Lekki obrót, żeby nie stała idealnie prosto
            >
                <planeGeometry args={[0.3, 0.4]} />
                <meshStandardMaterial
                    map={standingFrameTexture}
                    transparent={true}
                    alphaTest={0.1}
                    side={THREE.DoubleSide}
                    roughness={0.8}
                />
            </mesh>


            {/* === DRZEWKO W DONICZCE (POTTED TREE) === */}
            {/* Kolo drzwi Contact (Right -62). Ustawiamy na -58, ODWROTNIE (Left). */}
            <mesh
                position={[-wallX + 0.8, floorY + 1.5, zOffset - 58]} // Left side
                rotation={[0, Math.PI / 4, 0]} // Obrócone w stronę korytarza (z lewej)
            >
                <planeGeometry args={[1.8, 3]} />
                <meshStandardMaterial
                    map={treeTexture}
                    transparent={true}
                    alphaTest={0.1}
                    side={THREE.DoubleSide}
                    roughness={0.8}
                />
            </mesh>

            {/* === KRATKI WENTYLACYJNE (VENTILATION GRATES) === */}
            {/* Generujemy kratkę na przeciwległej ścianie dla każdego obrazu */}
            {frames.map((frame, i) => {
                const isFrameLeft = frame.side === 'left';
                const grateSide = isFrameLeft ? 'right' : 'left';

                return (
                    <mesh
                        key={`grate-${i}`}
                        position={[
                            grateSide === 'left' ? -wallX + 0.01 : wallX - 0.01,
                            ceilingY - 0.6, // Wysoko, tak jak ta pierwsza
                            frame.z // Ta sama pozycja Z co obrazu
                        ]}
                        rotation={[0, grateSide === 'left' ? Math.PI / 2 : -Math.PI / 2, 0]}
                    >
                        <planeGeometry args={[0.8, 0.5]} />
                        <meshStandardMaterial
                            map={grateTexture}
                            transparent={true}
                            alphaTest={0.1}
                            side={THREE.DoubleSide}
                            roughness={0.8}
                        />
                    </mesh>
                );
            })}

        </group >
    );
};

export default CorridorDecorations;

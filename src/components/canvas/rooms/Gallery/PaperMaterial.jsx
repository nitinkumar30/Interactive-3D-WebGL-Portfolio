import { forwardRef, useMemo, useRef, useImperativeHandle } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/**
 * PaperMaterial
 * A MeshStandardMaterial that supports bending via a custom vertex shader.
 * 
 * Uniforms accessible via ref:
 * - uBend: Float. Controls the amount of bending along the vertical axis.
 * - uBendAxis: Vector2. Direction of bending (not yet implemented, defaults to Y-axis bend).
 */
const PaperMaterial = forwardRef(({ color = '#e0e0e0', roughness = 0.6, map, side = THREE.DoubleSide, ...props }, ref) => {
    const materialRef = useRef();

    // Shader injection logic
    const onBeforeCompile = useMemo(() => (shader) => {
        // Add uniforms
        shader.uniforms.uBend = { value: 0 };
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uWindStrength = { value: 0 }; // Extra flutter intensity
        shader.uniforms.mapBack = { value: null }; // Back texture
        shader.uniforms.mapPainted = { value: null }; // Painted texture
        shader.uniforms.uProgress = { value: 0.0 }; // Reveal progress

        // Prepend uniforms to vertex shader
        shader.vertexShader = `
            uniform float uBend;
            uniform float uTime;
            uniform float uWindStrength;
        ` + shader.vertexShader;

        // Inject bending logic before gl_Position
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            `
            #include <begin_vertex>
            
            // Simple parabolic bend
            float bendAmount = pow(transformed.y, 2.0) * uBend;
            transformed.z += bendAmount;

            // Add subtle flutter inspired by wind
            // Base flutter + Extra Wind Strength on hover
            float totalWind = 0.02 + uWindStrength; 
            // SLOWER FLUTTER: Reduced speed (uTime * 2.0) and frequency (y * 2.0)
            float flutter = sin(uTime * 2.0 + transformed.y * 2.0) * totalWind * (1.0 + abs(uBend * 3.0));
            transformed.z += flutter;
            `
        );

        // Inject Fragment Shader logic for double-sided texturing
        shader.fragmentShader = `
            uniform sampler2D mapBack;
            uniform sampler2D mapPainted;
            uniform float uProgress;

            float revealRand(vec2 n) { 
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float revealNoise(vec2 p){
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);
                float res = mix(
                    mix(revealRand(ip),revealRand(ip+vec2(1.0,0.0)),u.x),
                    mix(revealRand(ip+vec2(0.0,1.0)),revealRand(ip+vec2(1.0,1.0)),u.x),u.y);
                return res*res;
            }
        ` + shader.fragmentShader;

        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #ifdef USE_MAP
                vec4 texColor = texture2D( map, vMapUv );

                // --- Added Brush Reveal Logic ---
                if (gl_FrontFacing && uProgress > 0.001) {
                    vec4 paintedColor = texture2D(mapPainted, vMapUv);
                    float rn = revealNoise(vMapUv * 15.0) * 0.15;
                    float maskValue = (1.0 - vMapUv.y) + rn;
                    float threshold = uProgress * 1.5;
                    if (maskValue < threshold) {
                        texColor = paintedColor;
                    }
                }
                
                // Flip Y UV to turn it upside down as requested
                // And keep X standard (vMapUv.x) to create a mirror effect (since back view naturally mirrors)
                vec2 backUv = vec2(vMapUv.x, 1.0 - vMapUv.y);
                vec4 backColor = texture2D( mapBack, backUv );
                
                vec4 sampledDiffuseColor = gl_FrontFacing ? texColor : backColor;
                
                diffuseColor *= sampledDiffuseColor;
                
                // Slight brightness boost for readability
                diffuseColor.rgb *= 1.4;
            #endif
            `
        );

        // Store reference to shader to update uniforms later
        materialRef.current.userData.shader = shader;

        // Initial update if props provided
        if (props.mapBack && shader.uniforms.mapBack) {
            shader.uniforms.mapBack.value = props.mapBack;
        }
        if (props.mapPainted && shader.uniforms.mapPainted) {
            shader.uniforms.mapPainted.value = props.mapPainted;
        }
    }, [props.mapBack, props.mapPainted]);

    useImperativeHandle(ref, () => ({
        // Getter/Setter for bend
        set bend(value) {
            if (materialRef.current?.userData?.shader) {
                materialRef.current.userData.shader.uniforms.uBend.value = value;
            }
        },
        get bend() {
            return materialRef.current?.userData?.shader?.uniforms.uBend.value || 0;
        },
        // Getter/Setter for windStrength
        set windStrength(value) {
            if (materialRef.current?.userData?.shader) {
                materialRef.current.userData.shader.uniforms.uWindStrength.value = value;
            }
        },
        get windStrength() {
            return materialRef.current?.userData?.shader?.uniforms.uWindStrength.value || 0;
        },
        // Getter/Setter for uProgress
        set uProgress(value) {
            if (materialRef.current?.userData?.shader) {
                materialRef.current.userData.shader.uniforms.uProgress.value = value;
            }
        },
        get uProgress() {
            return materialRef.current?.userData?.shader?.uniforms.uProgress.value || 0;
        },
        // We can also expose the raw material if needed
        material: materialRef.current
    }), []);

    useFrame((state) => {
        if (materialRef.current?.userData?.shader) {
            materialRef.current.userData.shader.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        <meshBasicMaterial
            ref={materialRef}
            map={map}
            color={color}
            roughness={roughness}
            side={side}
            onBeforeCompile={onBeforeCompile}
            {...props}
        />
    );
});

export default PaperMaterial;

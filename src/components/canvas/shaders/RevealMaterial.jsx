import * as THREE from 'three';
import { extend } from '@react-three/fiber';

/**
 * RevealMaterial - extends MeshStandardMaterial for brush-stroke reveal effect.
 * 
 * KEY INSIGHT: Only modifies the DISCARD logic (alpha), NOT the color/lighting.
 * Colors and lighting stay 100% standard MeshStandardMaterial pipeline.
 * The custom shader only decides WHICH pixels to hide (with noisy brush-stroke edge).
 * 
 * Usage: <revealMaterial color="#e0e0e0" map={sketchTex} uProgress={0-1} transparent={true} ... />
 * Place behind a painted texture mesh. As uProgress increases, sketch pixels get 
 * discarded from bottom to top with noisy edges, revealing the painted door beneath.
 */
class RevealMaterial extends THREE.MeshBasicMaterial {
    constructor(params = {}) {
        super(params);
        this._uProgress = 0.0;
        this._shader = null;
    }

    get uProgress() { return this._uProgress; }
    set uProgress(v) {
        this._uProgress = v;
        if (this._shader) {
            this._shader.uniforms.uProgress.value = v;
        }
    }

    // Ensure Three.js doesn't reuse a cached standard shader program
    customProgramCacheKey() {
        return 'RevealMaterial_v1';
    }

    onBeforeCompile(shader) {
        this._shader = shader;
        shader.uniforms.uProgress = { value: this._uProgress };

        // Inject uProgress uniform and noise functions into fragment shader
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            /* glsl */`#include <common>
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
            `
        );

        // After standard alpha test (which handles transparent sketch edges),
        // apply our brush-stroke progressive discard based on uProgress
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <alphatest_fragment>',
            /* glsl */`#include <alphatest_fragment>

            // Brush-stroke reveal: progressively discard pixels from bottom to top
            if (uProgress > 0.001) {
                float rn = revealNoise(vMapUv * 15.0) * 0.15;
                float maskValue = (1.0 - vMapUv.y) + rn;
                float threshold = uProgress * 1.5;
                if (maskValue < threshold) discard;
            }
            `
        );
    }
}

// Register so R3F can use <revealMaterial color="#e0e0e0" />
extend({ RevealMaterial });

export { RevealMaterial };

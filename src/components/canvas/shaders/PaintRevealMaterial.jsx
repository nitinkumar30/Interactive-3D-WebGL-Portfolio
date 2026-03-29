import * as THREE from 'three';
import { extend } from '@react-three/fiber';

/**
 * PaintRevealMaterial - extends MeshStandardMaterial for brush-stroke paint reveal.
 * 
 * Instead of discarding pixels (like RevealMaterial), this material BLENDS
 * between the base sketch texture (map) and a painted version (uMapPainted)
 * using the same noisy brush-stroke mask pattern.
 * 
 * Usage: <paintRevealMaterial map={sketchTex} uMapPainted={paintedTex} uProgress={0-1} />
 * As uProgress goes from 0→1, pixels transition from sketch to painted with noisy edges.
 */
class PaintRevealMaterial extends THREE.MeshBasicMaterial {
    constructor(params = {}) {
        // Extract custom params before passing to super
        const { uMapPainted, ...standardParams } = params;
        super(standardParams);
        this._uProgress = 0.0;
        this._uMapPainted = uMapPainted || null;
        this._shader = null;
    }

    get uProgress() { return this._uProgress; }
    set uProgress(v) {
        this._uProgress = v;
        if (this._shader) {
            this._shader.uniforms.uProgress.value = v;
        }
    }

    get uMapPainted() { return this._uMapPainted; }
    set uMapPainted(v) {
        this._uMapPainted = v;
        if (this._shader) {
            this._shader.uniforms.uMapPainted.value = v;
        }
    }

    customProgramCacheKey() {
        return 'PaintRevealMaterial_v1';
    }

    onBeforeCompile(shader) {
        this._shader = shader;
        shader.uniforms.uProgress = { value: this._uProgress };
        shader.uniforms.uMapPainted = { value: this._uMapPainted };

        // Inject uniforms and noise into fragment shader
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <common>',
            /* glsl */`#include <common>
            uniform float uProgress;
            uniform sampler2D uMapPainted;

            float paintRand(vec2 n) { 
                return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
            }

            float paintNoise(vec2 p){
                vec2 ip = floor(p);
                vec2 u = fract(p);
                u = u*u*(3.0-2.0*u);
                float res = mix(
                    mix(paintRand(ip),paintRand(ip+vec2(1.0,0.0)),u.x),
                    mix(paintRand(ip+vec2(0.0,1.0)),paintRand(ip+vec2(1.0,1.0)),u.x),u.y);
                return res*res;
            }
            `
        );

        // After the map fragment (which samples the base texture into sampledDiffuseColor),
        // blend with the painted texture based on uProgress
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            /* glsl */`#include <map_fragment>

            // Brush-stroke blend: progressively swap sketch→painted
            if (uProgress > 0.001) {
                vec4 paintedColor = texture2D(uMapPainted, vMapUv);
                float rn = paintNoise(vMapUv * 15.0) * 0.15;
                // Reveal from bottom-left to top-right for organic feel
                float maskValue = (1.0 - vMapUv.y) + rn;
                float threshold = uProgress * 1.5;
                if (maskValue < threshold) {
                    // Replace the diffuseColor with painted version
                    diffuseColor = vec4(paintedColor.rgb, 1.0);
                }
            }
            `
        );
    }
}

// Register so R3F can use <paintRevealMaterial />
extend({ PaintRevealMaterial });

export { PaintRevealMaterial };

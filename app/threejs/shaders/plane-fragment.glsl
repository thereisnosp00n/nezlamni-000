precision highp float;

uniform vec2 uResolution;
uniform sampler2D tMap;
uniform float uAlpha;
uniform float uTime;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 colorPosition;
varying vec3 vColor;

//	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
// 2D Random
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// 2D Noise based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    // Smooth Interpolation

    // Cubic Hermine Curve.  Same as SmoothStep()
    vec2 u = f*f*(3.0-2.0*f);
    // u = smoothstep(0.,1.,f);

    // Mix 4 coorners percentages
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 st = gl_FragCoord.xy/uResolution.xy;

    float test = dot(vNormal, vec3(0.0, -1.0, 0.0));

    // Scale the coordinate system to see
    // some noise in action
    vec2 pos = vec2(st*12.0);

    // Use the noise function
    float n = noise(pos);

    vec3 clampedColor = colorPosition * vNormal;

    gl_FragColor = vec4(vColor, 1.0);
}
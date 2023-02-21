varying vec2 vUv;
varying vec3 vNormal;
varying vec3 colorPosition;
varying vec3 vColor;
uniform float uTime;
uniform vec2 uMouse;

#pragma glslify: perlin4d = require('./partials/perlin4d.glsl');
#pragma glslify: perlin3d = require('./partials/perlin3d.glsl');

#define PI 3.14159265359

void main() {

    vec3 newPosition = position;

    float uDistortionFrequency = 0.6;
    float uDistortionStrength = 0.2;
    float distorionStrength = perlin3d(vec3(position.xy * uDistortionFrequency, uTime * 0.01));

    float uDisplacementFrequency = 3.0;
    float uDisplacementStrength = 0.1;
    vec3 displacementPosition = position * uDisplacementFrequency;
    displacementPosition.x += distorionStrength * 5.;
    displacementPosition.y += distorionStrength * 0.8;
    float perlinStrength = perlin4d(vec4(displacementPosition, uTime * 0.01)) * uDisplacementStrength;

    float shift = distorionStrength*0.01 / sin(0.5);  

    newPosition += normal * perlinStrength * (pow(PI, 0.001));  

    // newPosition += normal * perlinStrength + distorionStrength*0.01;
    vec3 uLightAColor = vec3(1.0, 0.25, 0.75);
    vec3 uLightAPosition = vec3(1.0, 1.0, 0.0);
    float lightAIntensity = max(0.0, - dot(normal, normalize(- uLightAPosition)));

    vec3 uLightBColor = vec3(.5, .25, 1.);
    vec3 uLightBPosition = vec3(1.0, 1.0, 0.0);
    float lightBIntensity = max(0.0, - dot(normal, normalize(uLightBPosition)));
    
    vec3 color = vec3(0.0);
    color = mix(color, uLightAColor, lightAIntensity);
    color = mix(color, uLightBColor, lightBIntensity);

    vec4 viewPosition = viewMatrix* vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;

    vNormal = normal;
    colorPosition = newPosition;
    vColor = color;

    // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
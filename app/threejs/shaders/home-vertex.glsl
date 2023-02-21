#define PI 3.14372423784278

varying vec2 vUv;

uniform float uStrength;
uniform vec2 uViewportSizes;

void main() {
    vUv = uv;

    vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

    //newPosition.z -= sin((newPosition.y / uViewportSizes.y) * (newPosition.x / uViewportSizes.x) * PI + PI / 2.0) * abs(uStrength);
    newPosition.z -= (sin((newPosition.y / uViewportSizes.y) * PI + PI / 2.0) + sin((newPosition.x / uViewportSizes.x) * PI + PI / 2.0)) * abs(uStrength);


    gl_Position = projectionMatrix * newPosition;
}
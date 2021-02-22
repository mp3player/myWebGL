#version 300 es

precision mediump float;

uniform vec3 color;
uniform sampler2D pic;

in vec3 oColor;
in vec2 oUv;
in vec3 oNormal;

out vec4 fColor;

void main(){
    fColor = vec4(abs(oNormal),1.0);
}
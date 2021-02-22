#version 300 es

precision mediump float;

layout(location=1)in vec3 iPosition;
layout(location=2)in vec3 iNormal;
layout(location=3)in vec2 iUv;
layout(location=4)in vec3 iColor;

uniform mat4 camera;
uniform mat4 view;
uniform float rotate;


out vec3 oColor ;
out vec2 oUv;
out vec3 oNormal;

void main(){

    gl_Position = camera * view * vec4(iPosition,1.0);
    gl_PointSize = 20.0;
    oColor = iColor;
    oUv = iUv;
    oNormal = iNormal;
}

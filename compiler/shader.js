// import { AmbientLightStruct , DirectionalLightStruct } from './struct.js'



function preCompile(str){
    while(/#include<([a-zA-Z_]+)>/.test(str)){
        str = str.replace(/#include<([a-zA-Z_]+)>/,d => {
            return eval(RegExp.$1);
        })
    }
    return str;
}

const version = '#version 300 es';
const precision = 'precision mediump float;'

const vertex_attribute = `
layout(location = 0)in vec3 iPosition;
layout(location = 1)in vec3 iNormal;
layout(location = 2)in vec2 iUv;
layout(location = 3)in vec3 iColor;
layout(location = 4)in vec3 iTangant;
layout(location = 5)in vec3 iBitangant;

out vec3 oPosition;
out vec3 oNormal;
out vec2 oUv;
out vec3 oColor;

`
const light = `
struct AmbientLight{
    vec3 color;
    float intensity;
};

struct DirectionalLight {
    vec3 color;
    float intensity;
    vec3 direction;
};

struct SpotLight {
    vec3 color;
    float intensity;
    vec3 position;
    vec3 direction;
    vec3 target;
    float scale;
};

struct PointLight {
    vec3 color;
    float intensity;
    vec3 position;
};


uniform AmbientLight ambient_light_0;
uniform DirectionalLight directional_light_0;
uniform SpotLight spot_light_0;
uniform PointLight point_light_0;
`

const uniform = `
uniform sampler2D map;
uniform sampler2D normalMap;

uniform bool useMap;
uniform bool useNormalMap;

uniform vec3 color;
uniform bool enableColor;

uniform bool vertexColor;
uniform float opacity;


`

const frag_attribute = `
in vec3 oPosition;
in vec3 oNormal;
in vec2 oUv;
in vec3 oColor;

out vec4 fColor;
`

const matrix = `

uniform mat4 perspectiveMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 mvp;
uniform mat3 normalMatrix;

`

const func_light = `
vec3 ambient_light(in vec3 color,AmbientLight light){
    return color * light.color * light.intensity;
}
vec3 directional_light(in vec3 color,DirectionalLight light,in vec3 normal){
    vec3 n = normalize(normal);
    float weight = max(dot(n,-normalize(light.direction)),0.0f);
    vec3 c = color * light.color * light.intensity * weight;
    return c;
}
vec3 spot_light(in vec3 color,SpotLight light ,in vec3 normal){
    light.position = vec4(light.position,1.0f).xyz;
    vec3 n = normalize(normal);

    vec3 shine = normalize(oPosition - light.position);

    float scale = dot(shine,normalize(light.direction));

    if(scale > light.scale){
        // float show = dot(n,-shine) > 0.0f ? 1.0f : 0.0f;
        float show = max(dot(n,-shine),0.0f);
        float a = smoothstep(0.0f,1.0f,show);
        return vec3(a);
    }
    return vec3(0.0f);
}

vec3 point_light(in vec3 color,PointLight light,in vec3 normal){
    vec3 shine = normalize(light.position - oPosition);

    float weight = max(dot(normalize(normal),shine),0.0f);

    return vec3(abs(weight));
}
`

const helper = {
    vertex:`#include<version>
#include<precision>
uniform mat4 perspectiveMatrix ;
uniform mat4 viewMatrix;

layout(location = 0)in vec3 position;

void main(){
    gl_Position = perspectiveMatrix * viewMatrix * vec4(position,1.0f);
}
    `,
    fragment:`#include<version>
#include<precision>

uniform vec3 color;
out vec4 fColor;
void main(){
    fColor = vec4(vec3(1.0f),1.0f);
}
`
}

const basic = {
    vertex : `#include<version>
#include<precision>
#include<matrix>
#include<vertex_attribute>

void main(){
    gl_Position = mvp * vec4(iPosition,1.0);
    oPosition = iPosition;
    oNormal = iNormal;
    oUv = iUv;
    oColor = iColor;
}
    `,
    fragment:`#include<version>
#include<precision>
#include<matrix>
#include<frag_attribute>
#include<uniform>

void main(){
    if(useMap && enableColor){
        vec4 textureColor = texture(map,oUv);
        fColor = vec4(textureColor.rgb * color ,opacity);
    }else if(useMap){
        vec4 textureColor = texture(map,oUv);
        fColor = textureColor;
    }else if(enableColor){
        fColor = vec4(color,opacity);
    }else{
        fColor = vec4(vec3(0.0f),opacity);
    }

    if(vertexColor){
        fColor = vec4(oColor,1.0f);
    }
}
    `
}

const lambert = {
    vertex:`#include<version>
#include<precision>
#include<matrix>
#include<vertex_attribute>

out mat3 tbn;
void main(){
    gl_Position = mvp * vec4(iPosition,1.0f);
    oPosition = iPosition;
    oNormal = normalMatrix * iNormal;
    oUv = iUv;

    vec3 t = normalize(mat3(modelMatrix) * iTangant);
    vec3 b = normalize(mat3(modelMatrix) * iBitangant);

    tbn = mat3(t,b,normalize(oNormal));
}
`,
    fragment:`#include<version>
#include<precision>
#include<matrix>
#include<frag_attribute>
#include<light>
#include<uniform>
#include<func_light>

in mat3 tbn;

void main(){
    vec3 normal;
    if(useMap){
        vec3 normalColor = texture(normalMap,oUv).xyz;
        normal = (2.0f * normalColor - vec3(1.0f));
        normal = normalize(tbn * normal);
        fColor = vec4(1.0f);
    }else{
        normal = oNormal;
    }

    vec3 origin_color;
    if(enableColor && useMap){
        origin_color = color * texture(map,oUv).xyz;
        // fColor = vec4(color * texture(map,oUv).xyz,1.0f);
    }else if(useMap){
        origin_color = texture(map,oUv).xyz;
        // fColor = vec4(vec3(0.0f,1.0f,0.0f),1.0f);
    }else{
        origin_color = color;
        // fColor = vec4(vec3(0.0f,0.0f,1.0f),1.0f);
    }

    // origin_color = vec3(1.0f);

    vec3 ambient_color = ambient_light(origin_color,ambient_light_0);
    vec3 direction_color = directional_light(origin_color,directional_light_0,normal);
    vec3 spot_color = spot_light(origin_color,spot_light_0,normal);
    vec3 point_color = point_light(origin_color,point_light_0,normal);

    vec3 endColor = ambient_color + direction_color + spot_color + point_color;

    fColor = vec4(endColor,1.0f);
}
`
}

const phong = {
    vertex:`#include<version>
#include<precision>
#include<vertex_attribute>
#include<matrix>

void main(){
    gl_Position = perspectiveMatrix * viewMatrix * vec4(iPosition,1.0f);
    oPosition = iPosition;
    oUv = iUv;
    oNormal = iNormal;
}
    `,
    fragment:`#include<version>
#include<precision>
#include<frag_attribute>
#include<light>
#include<map>
#include<uniform>

void main(){

}
    `
}

const offScreen = {
    vertex:`#include<version>
#include<precision>
#include<matrix>
#include<vertex_attribute>

void main(){
    gl_Position = vec4(iPosition,1.0f);
    oUv = iUv;
}
    `,
    fragment:`#include<version>
#include<precision>
#include<frag_attribute>

uniform sampler2D map;

void main(){
    fColor = texture(map,oUv);
}
    `
}

export {offScreen,phong,helper,lambert,basic,preCompile,version,vertex_attribute,frag_attribute,matrix}

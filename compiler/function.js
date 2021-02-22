const ambientLightMix = `
vec3 ambient_light_mix(in vec3 color, in AmbientLight light){
    return color * light.color * light.intensity;
}
`

const directionalLightMix = `
vec3 directional_light_mix(in vec3 color,in DirectionalLight light,in vec3 normal){

}
`

export {ambientLightMix,directionalLightMix}

const AmbientLightStruct = `
    struct AmbientLight {
        vec3 color;
        float intensity;
    }
`;

const DirectionLightStruct = `
    struct DirectionalLight {
        vec3 color;
        float intensity;
        vec3 direction;
    }
`;

const SpotLightStruct = ``;

const PointLightStruct = ``;

export {AmbientLightStruct,DirectionLightStruct,SpotLightStruct,PointLightStruct}

class Light {
    constructor(color,intensity){
        this.color = color;
        this.intensity = intensity;
        this.type = 'light';
    }

}

class AmbientLight extends Light{
    constructor(color,intensity){
        super(color,intensity);
        this.name = 'ambient'
    }

}

class DirectionalLight extends Light{
    constructor(color,intensity){
        super(color,intensity);
        this.name = 'directional';
        this.position = [0,0,1];
        this.lookAt = [0,0,0];
        this.direction = [0,0,1];
    }
    compile(){
        this.direction = [
            this.lookAt[0] - this.position[0],
            this.lookAt[1] - this.position[1],
            this.lookAt[2] - this.position[2]
        ]
    }
}

class SpotLight extends Light {
    constructor(color,intensity){
        super(color,intensity);
        this.name = 'spot';
        this.scale = 1;
        this.position = [0,0,1];
        this.lookAt = [0,0,0];
        this.direction = [0,0,-1]
    }
    compile(){
        this.direction = [
            this.lookAt[0] - this.position[0] ,
            this.lookAt[1] - this.position[1] ,
            this.lookAt[2] - this.position[2] ,
        ];
    }
}

class PointLight extends Light {
    constructor(color,intensity){
        super(color,intensity);
        this.name = 'point';
        this.position = [0,0,1];
    }
}

export {AmbientLight,DirectionalLight,SpotLight,PointLight}

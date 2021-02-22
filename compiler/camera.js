import {mat4,vec4,mat3,vec3} from 'gl-matrix'

class Object3D{
    constructor(){
        this.renderToScreen = true;
        this.renderTarget = null;
        this.type = 'object3d'
        this.position = vec3.create([0,0,0]);
        this.lookAt = vec3.create([0,0,0]);
        this.up = vec3.create();
        this.up[1] = 1;

        this.wordMat = mat4.create();
        this.transformMat = mat4.create();
        this.rotateX(0);

    }
    rotateX(x){
        mat4.rotate(this.transformMat,this.transformMat,x,[1,0,0,1]);
    }
    rotateY(y){
        mat4.rotate(this.transformMat,this.transformMat,y,[0,1,0,1]);
    }
    rotateZ(z){
        mat4.rotate(this.transformMat,this.transformMat,z,[0,0,1,1]);
    }
    scaleX(x){
        mat4.scale(this.transformMat,this.transformMat,[x,1,1,1]);
    }
    scaleY(y){
        mat4.scale(this.transformMat,this.transformMat,[1,y,1,1]);
    }
    scaleZ(z){
        mat4.scale(this.transformMat,this.transformMat,[1,1,z,1]);
    }
    translateX(x){
        mat4.translate(this.transformMat,this.transformMat,[x,0,0,1]);
    }
    translateY(y){
        mat4.translate(this.transformMat,this.transformMat,[0,y,0,1]);
    }
    translateZ(z){
        mat4.translate(this.transformMat,this.transformMat,[0,0,z,1]);
    }
}
class Camera extends Object3D{
    constructor(fov=45,aspect=1,near=0.1,far=100){
        super();
        this.type = 'camera';
        this.aspect = aspect;
        this.fov = fov;
        this.near = near;
        this.far = far;
        this.projection = mat4.create();
        this.view = mat4.create();
    }
    control(ele){
        ele.onmousedown = (e) => {
            if(e.button != 0)
                return ;
            let x = e.x,y = e.y;
            let len = vec3.dist(this.position,this.lookAt)

            ele.onmousemove = (ev) => {
                let ox = ev.x - x,oy = ev.y - y;
                x = ev.x , y = ev.y ;

                vec3.rotateY(this.position,this.position,[0,0,0],-ox * Math.PI / 180)

                this.position[1] += oy / 10;
                let len1 = vec3.dist(this.position,this.lookAt);
                this.position[0] *= len / len1;
                this.position[1] *= len / len1;
                this.position[2] *= len / len1;

            }
            ele.onmouseup = function(e){
                this.onmousemove = null;
                this.onmouseup = null;
            }
        }
        ele.onmousewheel = (e) => {
            let len = vec3.dist(this.position,this.lookAt)

            let dis = e.deltaY;
            if(dis > 0){
                this.position[0] += this.position[0] / 10;
                this.position[1] += this.position[1] / 10;
                this.position[2] += this.position[2] / 10;
            }else{
                this.position[0] -= this.position[0] / 10;
                this.position[1] -= this.position[1] / 10;
                this.position[2] -= this.position[2] / 10;
            }

        }
    }
    render(){
        mat4.perspective(this.projection,this.fov * Math.PI / 180,this.aspect,this.near,this.far);
        mat4.lookAt(this.view,this.position,this.lookAt,this.up);
    }
}
export default Camera;

export {Camera,Object3D}

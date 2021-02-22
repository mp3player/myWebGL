import {ObjLoader,Obj} from './compiler/obj'
import Compiler from './compiler/compiler'
import Camera from './compiler/camera.js'
import Renderer from './compiler/renderer.js'
import Scene from './compiler/scene.js'
import {BasicMaterial,HelperMaterial,LambertMaterial,Material,OffScreenMaterial} from './compiler/material.js'
import Texture from './compiler/texture.js'
import { AmbientLight,DirectionalLight,SpotLight,PointLight} from './compiler/light.js'
import AxesHelper from './compiler/axes.js'
import GridHelper from './compiler/grid.js'
import Mesh from './compiler/mesh.js'
import Display from './compiler/display.js'
import SkyBox from './compiler/sky-box.js'
import {vec3,mat4} from 'gl-matrix'

const loader = new ObjLoader();

// const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl2');

window.gl = gl

const scene = new Scene();
const renderer = new Renderer(canvas);

const ambient = new AmbientLight([1,1,1],0.2);
scene.add(ambient);

const directional = new DirectionalLight([1,1,1],1.0);
directional.position = [1,1,1]
// scene.add(directional)

const spot = new SpotLight([1,1,1],1.0);
spot.position = [0,0,2];
spot.scale = 0.99;
spot.lookAt = [0,0,0];
scene.add(spot)

let rayMesh = new Mesh(new HelperMaterial({
    color:[1,0,1]
}))
rayMesh.setPosition([
    0,0,0,
    0,0,1000
]);
rayMesh.mode = 'line';
scene.add(rayMesh);

let res = vec3.create();
let x ,y;

canvas.oncontextmenu = function(e){
    e.preventDefault();
    //normalize
    // let x = e.x;
    // let y = e.y;
    // let deviceX = (x - canvas.width / 2) / canvas.width * 2
    // let deviceY = (canvas.width / 2 - y) / canvas.height * 2;

    // //设备坐标系
    // let ray = [deviceX,deviceY,1];

    // //转换到视图坐标系
    
    // let invertProjectionMatrix = mat4.create();
    // mat4.invert(invertProjectionMatrix,camera.projection);
    // console.log(invertProjectionMatrix);
    // vec3.transformMat4(res,ray,invertProjectionMatrix);
    // //转换到世界空间
    // mat4.invert(invertProjectionMatrix,camera.view);
    // vec3.transformMat4(res,res,invertProjectionMatrix)
    // console.log(camera.position.concat(ray));
    // rayMesh.setPosition([0,0,0].concat([res[0],res[1],res[2]]))
    // console.log(camera.position.concat([res[0],res[1],res[2]]));

    // spot.lookAt = [res[0],res[1],res[2]]
    // spot.position = camera.position;

    canvas.onmousemove = e => {
        e.preventDefault();
        //normalize
        x = e.x;
        y = e.y;
        let deviceX = (x - canvas.width / 2) / canvas.width * 2
        let deviceY = (canvas.width / 2 - y) / canvas.height * 2;

        //设备坐标系
        let ray = [deviceX,deviceY,-1];

        //转换到视图坐标系
        
        let invertProjectionMatrix = mat4.create();
        mat4.invert(invertProjectionMatrix,camera.projection);
        vec3.transformMat4(res,ray,invertProjectionMatrix);

        //转换到世界空间
        mat4.invert(invertProjectionMatrix,camera.view);
        vec3.transformMat4(res,res,invertProjectionMatrix)
        rayMesh.setPosition([0,0,1].concat([res[0],res[1],res[2]]))
        // spot.lookAt = [res[0],res[1],res[2]]
        let end = [res[0],res[1],res[2]];
        //变换相机坐标
        let cp = [camera.position[0],camera.position[1],camera.position[2]];
        mat4.invert(invertProjectionMatrix,camera.projection);
        vec3.transformMat4(res,cp,invertProjectionMatrix);

        // mat4.invert(invertProjectionMatrix,camera.view);
        // vec3.transformMat4(res,res,invertProjectionMatrix)
        rayMesh.setPosition([cp].concat(end))
        // console.log([res[0],res[1],res[2]].concat(end))
        // spot.position = camera.position;
        console.log(cp.concat(end))
        spot.position = cp;
        spot.lookAt = end;
        
    }
}


const point = new PointLight([1,1,1],0.0);
// scene.add(point);
point.position = [-2,-2,-2];

const camera = new Camera(45,1,.001,10000);

camera.position = [10,10,10];

camera.render();

camera.control(canvas);

let helper = new AxesHelper(10,10,10);
scene.add(helper);
let grid = new GridHelper(10,10,2);
// scene.add(grid)

let mesh = null;

loader.load('./model/untitled.obj' , d => {
    scene.add(d)
    mesh = d;
    d.material = new LambertMaterial({
        color : [1,1,1],
        map: new Texture('./floor.jpg'),
        normalMap:new Texture('./normal.jpg'),
    })
})


let a = () => {
    camera.render()
    // camera.renderToScreen = false;
    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    renderer.render(scene,camera);
    {
        let deviceX = (x - canvas.width / 2) / canvas.width * 2
        let deviceY = (canvas.width / 2 - y) / canvas.height * 2;

        //设备坐标系
        let ray = [deviceX,deviceY,-1];

        //转换到视图坐标系
        
        let invertProjectionMatrix = mat4.create();
        mat4.invert(invertProjectionMatrix,camera.projection);
        vec3.transformMat4(res,ray,invertProjectionMatrix);

        //转换到世界空间
        mat4.invert(invertProjectionMatrix,camera.view);
        vec3.transformMat4(res,res,invertProjectionMatrix)
        rayMesh.setPosition([0,0,1].concat([res[0],res[1],res[2]]))
        // spot.lookAt = [res[0],res[1],res[2]]
        let end = [res[0],res[1],res[2]];
        //变换相机坐标
        let cp = [camera.position[0],camera.position[1],camera.position[2]];
        mat4.invert(invertProjectionMatrix,camera.projection);
        vec3.transformMat4(res,cp,invertProjectionMatrix);

        // mat4.invert(invertProjectionMatrix,camera.view);
        // vec3.transformMat4(res,res,invertProjectionMatrix)
        rayMesh.setPosition([cp].concat(end))
        // console.log([res[0],res[1],res[2]].concat(end))
        // spot.position = camera.position;
        console.log(cp.concat(end))
        spot.position = cp;
        spot.lookAt = end;
    }
    // if(!mesh)
        requestAnimationFrame(a);
}
a()

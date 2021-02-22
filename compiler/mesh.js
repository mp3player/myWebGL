import Compiler from './compiler'
import {Object3D} from './camera.js'
import {vec3,mat4} from 'gl-matrix'
import {BasicMaterial} from './material.js'
import Texture from './texture.js'
import {mat3} from 'gl-matrix'


export default class Mesh extends Object3D{
    constructor(material){
        super(1);
        this.type = 'mesh';
        this.position = [];
        this.color = [];
        this.normal = [];
        this.uv = [];
        this.index = [];
        this.material = material ? material : null;
        this.tbo = null;
        this.mode = 'triangle';
    }
    setPosition(position){
        this.position = position;
    }
    setColor(color){
        this.color = color;
    }
    setNormal(normal){
        this.normal = normal;
    }
    setUv(uv){
        this.uv = uv;
    }
    setIndex(index){
        this.index = index;
    }
    render(gl,camera,i){
        let position = this.position;

        let material = this.material;
        let ts = [],bs = [];

        let p = position;
        for(let i=0;i<p.length / 9;i++){    //triangle

            let p0 = [ p[ i * 9 ] , p[ i * 9 + 1 ] , p[ i * 9 + 2 ] ];
            let p1 = [ p[ i * 9 + 3 ] , p[ i * 9 + 4 ] , p[ i * 9 + 5 ] ];
            let p2 = [ p[ i * 9 + 6 ] , p[ i * 9 + 7 ] , p[ i * 9 + 8 ] ];

            let uv0 = [ this.uv[ i * 6 ] , this.uv[ i * 6 + 1] ];
            let uv1 = [ this.uv[ i * 6 + 2 ] , this.uv[ i * 6 + 3] ];
            let uv2 = [ this.uv[ i * 6 + 4 ] , this.uv[ i * 6 + 5] ];

            // console.log(uv0,uv1,uv2);
            let duv0 = [ uv1[0] - uv0[0] , uv1[1] - uv0[1] ];
            let duv1 = [ uv2[0] - uv0[0] , uv2[1] - uv0[1] ];



            let dedge0 = [ p1[0] - p0[0] , p1[1] - p0[1] , p1[2] - p0[2] ];
            let dedge1 = [ p2[0] - p0[0] , p2[1] - p0[1] , p2[2] - p0[2] ];

            let f = 1 / (duv0[0] * duv1[1] - duv0[1] * duv1[0]);
            // console.log(f)
            let tx = f * (duv1[1] * dedge0[0] - duv0[1] * dedge1[0]);
            let ty = f * (duv1[1] * dedge0[1] - duv0[1] * dedge1[1]);
            let tz = f * (duv1[1] * dedge0[2] - duv0[1] * dedge1[2]);

            let bx = f * (-duv1[0] * dedge0[0] + duv0[0] * dedge1[0])
            let by = f * (-duv1[0] * dedge0[1] + duv0[0] * dedge1[1])
            let bz = f * (-duv1[0] * dedge0[2] + duv0[0] * dedge1[2])
            // console.log(f)

            ts.push(tx,ty,tz);
            ts.push(tx,ty,tz);
            ts.push(tx,ty,tz);

            bs.push(bx,by,bz);
            bs.push(bx,by,bz);
            bs.push(bx,by,bz);

        }

        if(!material.program)
            material.compile(gl);

        gl.useProgram(material.program)
        if(!material.vao)
            material.vao = Compiler.vao(gl);

        gl.bindVertexArray(material.vao);

        Compiler.i_vec3(gl,0,position);
        Compiler.i_vec3(gl,1,this.normal);
        Compiler.i_vec2(gl,2,this.uv);

        Compiler.i_vec3(gl,4,ts);
        Compiler.i_vec3(gl,5,bs);

        gl.bindVertexArray(null);


        //props--------------
        Compiler.u_float(gl,material.program,'opacity',material.opacity);
        //bind fix props
        Compiler.u_integer(gl,material.program,'vertexColor',material.vertexColor);
        //compiler map
        if(material.map){
            if(!material.map.tbo){
                material.map.compile(gl)
            }

            gl.activeTexture(gl.TEXTURE0)
            gl.bindTexture(gl.TEXTURE_2D,material.map.tbo);
            Compiler.u_integer(gl,material.program,'map',0);
            Compiler.u_integer(gl,material.program,'useMap',1);
        }else{
            Compiler.u_integer(gl,material.program,'useMap',0)
        }
        //normalMap
        if(material.normalMap){
            if(!material.normalMap.tbo){
                material.normalMap.compile(gl)
            }
            gl.activeTexture(gl.TEXTURE1)
            gl.bindTexture(gl.TEXTURE_2D,material.normalMap.tbo);
            Compiler.u_integer(gl,material.program,'normalMap',1);
            Compiler.u_integer(gl,material.program,'useNormalMap',1);
        }else{
            Compiler.u_integer(gl,material.program,'useNormalMap',0)
        }
        //aoMap
        //envMap
        //specularMap

        //bind color
        if(material.color){
            Compiler.u_vec3(gl,material.program,'color',material.color);
            Compiler.u_integer(gl,material.program,'enableColor',1);
        }else{
            Compiler.u_integer(gl,material.program,'enableColor',0);
        }

        // console.log(material.map)
        //------------------

        Compiler.u_mat4(gl,material.program,'perspectiveMatrix',camera.projection);
        Compiler.u_mat4(gl,material.program,'viewMatrix',camera.view);
        Compiler.u_mat4(gl,material.program,'modelMatrix',this.transformMat);
        let mvp = mat4.create();
        mat4.multiply(mvp,mvp,camera.projection)
        mat4.multiply(mvp,mvp,camera.view)
        mat4.multiply(mvp,mvp,this.transformMat);

        Compiler.u_mat4(gl,material.program,'mvp',mvp);

        let normalMatrix = new Float32Array([
            this.transformMat[0] , this.transformMat[1] , this.transformMat[2] ,
            this.transformMat[4] , this.transformMat[5] , this.transformMat[6] ,
            this.transformMat[8] , this.transformMat[9] , this.transformMat[10]
        ])

        mat3.invert(normalMatrix,normalMatrix);
        mat3.transpose(normalMatrix,normalMatrix);

        Compiler.u_mat3(gl,material.program,'normalMatrix',normalMatrix);

        gl.bindVertexArray(material.vao);

        switch(this.mode){
            case 'triangle':{
                gl.drawArrays(gl.TRIANGLES,0,this.position.length / 3)
            }break;
            case 'line':{
                gl.drawArrays(gl.LINE,0,this.position.length / 3)
            }
            case 'lines':{
                gl.drawArrays(gl.LINES,0,this.position.length / 3)
            }
        }
        
        // gl.drawElements(gl.TRIANGLES,this.index.length,gl.UNSIGNED_SHORT,0);

        gl.bindVertexArray(null);
        gl.bindTexture(gl.TEXTURE_2D,null);
    }
}

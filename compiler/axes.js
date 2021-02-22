import {Object3D} from './camera.js'
import {HelperMaterial} from './material.js'
import Compiler from './compiler.js'
export default class AxesHelper extends Object3D{
    constructor(x,y,z){
        super();
        this.type = 'helper';
        this.x = x;
        this.y = y;
        this.z = z;
        this.material = new HelperMaterial();
        this.flag = false;
    }
    render(gl,camera){
        if(!this.material.program){
            this.material.compile(gl);
            if(!this.material.program)
                return ;
        }

        gl.useProgram(this.material.program);

        let xP = [0,0,0,this.x,0,0];
        let xColor = [1,0,0];
        let yP = [0,0,0,0,this.y,0];
        let yColor = [0,1,0];
        let zP = [0,0,0,0,0,this.z];
        let zColor = [0,0,1];

        let xVao = Compiler.vao(gl);
        let yVao = Compiler.vao(gl);
        let zVao = Compiler.vao(gl);


        gl.bindVertexArray(xVao);
        Compiler.i_vec3(gl,0,xP);

        gl.bindVertexArray(yVao);
        Compiler.i_vec3(gl,0,yP);

        gl.bindVertexArray(zVao);
        Compiler.i_vec3(gl,0,zP);

        gl.bindVertexArray(xVao);

        Compiler.u_mat4(gl,this.material.program,'perspectiveMatrix',camera.projection);
        Compiler.u_mat4(gl,this.material.program,'viewMatrix',camera.view);
        Compiler.u_vec3(gl,this.material.program,'color',[1,0,0]);
        gl.drawArrays(gl.LINES,0,2);
        gl.bindVertexArray(null);



        gl.bindVertexArray(yVao);
        gl.useProgram(this.material.program);
        Compiler.u_mat4(gl,this.material.program,'perspectiveMatrix',camera.projection);
        Compiler.u_mat4(gl,this.material.program,'viewMatrix',camera.view);
        Compiler.u_vec3(gl,this.material.program,'color',[0,1,0]);
        gl.drawArrays(gl.LINES,0,2);
        gl.bindVertexArray(yVao);

        gl.bindVertexArray(zVao);
        gl.useProgram(this.material.program)
        Compiler.u_mat4(gl,this.material.program,'perspectiveMatrix',camera.projection);
        Compiler.u_mat4(gl,this.material.program,'viewMatrix',camera.view);
        Compiler.u_vec3(gl,this.material.program,'color',[0,0,1]);
        gl.drawArrays(gl.LINES,0,2)

        gl.bindVertexArray(null);
    }
}

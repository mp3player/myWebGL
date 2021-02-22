import {Object3D} from './camera.js'
import {HelperMaterial} from './material.js'
import Compiler from './compiler.js'
export default class GridHelper extends Object3D{
    constructor(x=10,y=10,segment=1){
        super();
        this.type = 'helper';
        this.x = x;
        this.y = y;
        this.segment = segment;
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

        //10 per two lines

        let xP = [];
        let yP = [];

        for(let i=-this.x;i<=this.x;i++){
            xP.push(-this.x * this.segment,0,i * this.segment)
            xP.push(this.x * this.segment,0,i * this.segment)
        }
        for(let i=-this.y;i<=this.y;i++){
            yP.push(i * this.segment,0,-this.y * this.segment);
            yP.push(i * this.segment,0,this.y * this.segment);
        }
        // console.log(xP)

        let xColor = [.4,.4,.4];
        let yColor = [.8,.8,.8];

        let xVao = Compiler.vao(gl);
        let yVao = Compiler.vao(gl);


        gl.bindVertexArray(xVao);
        Compiler.i_vec3(gl,0,xP);

        gl.bindVertexArray(yVao);
        Compiler.i_vec3(gl,0,yP);

        gl.bindVertexArray(xVao);

        Compiler.u_mat4(gl,this.material.program,'perspectiveMatrix',camera.projection);
        Compiler.u_mat4(gl,this.material.program,'viewMatrix',camera.view);
        Compiler.u_vec3(gl,this.material.program,'color',xColor);
        gl.drawArrays(gl.LINES,0,xP.length / 3);
        gl.bindVertexArray(null);

        gl.bindVertexArray(yVao);
        gl.useProgram(this.material.program);
        Compiler.u_mat4(gl,this.material.program,'perspectiveMatrix',camera.projection);
        Compiler.u_mat4(gl,this.material.program,'viewMatrix',camera.view);
        Compiler.u_vec3(gl,this.material.program,'color',yColor);
        gl.drawArrays(gl.LINES,0,yP.length / 3);
        gl.bindVertexArray(yVao);

        gl.bindVertexArray(null);
    }
}

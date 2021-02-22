import Compiler from './compiler.js'
import {OffScreenMaterial} from './material.js'

export default class Display {
    constructor(){
        this.material = new OffScreenMaterial();

        this.vao = null;
    }
    render(gl,camera){
        if(!this.vao){
            this.vao = Compiler.vao(gl);
            Compiler.i_vec3(gl,0,[
                -1,-1,0,
                1,-1,0,
                1,1,0,
                -1,-1,0,
                1,1,0,
                -1,1,0
            ]);
            Compiler.i_vec2(gl,2,[
                0,0,
                1,0,
                1,1,
                0,0,
                1,1,
                0,1
            ])
        }
        if(!this.material.program)
            this.material.compile(gl);

        gl.useProgram(this.material.program);
        gl.bindVertexArray(this.vao);

        //bind Texture
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D,this.material.map.tbo);
        Compiler.u_integer(gl,this.material.program,'map',0);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
        gl.bindVertexArray(null);
    }
}

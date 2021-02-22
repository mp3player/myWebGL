import Compiler from './compiler.js'
import {offScreen,helper,basic,lambert,preCompile} from './shader.js'
import Texture from './texture.js'

class Material {
    constructor(opt = {}){
        this.color = opt.color ? opt.color : [1,1,1];
        this.map = opt.map ? opt.map : null;
        this.normalMap = opt.normalMap ? opt.normalMap : null;
        this.program = null;
        this.vao = null;
        // this.transparent = opt.transparent ? opt.transparent : false;
        // this.opacity = opt.transparent ? opt.opacity : 100.0;
        // this.vertexColor = opt.vertexColor ? opt.vertexColor : false;
    }
    compile(gl){}
}

class HelperMaterial{
    constructor(){
        this.type = 'helper'
    }
    compile(gl){
        let vcode = preCompile(helper.vertex);
        let fcode = preCompile(helper.fragment);
        // console.log(vcode,fcode)
        this.program = Compiler.compileProgram(gl,vcode,fcode);
    }
}

class BasicMaterial extends Material {
    constructor(opt = {}){
        super(opt);
        this.type = 'basic'
    }
    compile(gl){
        let vcode = preCompile(basic.vertex);
        let fcode = preCompile(basic.fragment);
        // console.log(vcode,fcode)
        this.program = Compiler.compileProgram(gl,vcode,fcode);
    }
}

class LambertMaterial extends Material {
    constructor(opt={}){
        super(opt);
        this.type = 'lambert';
    }
    compile(gl){
        let vcode = preCompile(lambert.vertex);
        let fcode = preCompile(lambert.fragment);
        // console.log(fcode)
        this.program = Compiler.compileProgram(gl,vcode,fcode);
    }
}


class OffScreenMaterial{
    constructor(){
        this.map = {tbo:null}
    }
    compile(gl){
        let vcode = preCompile(offScreen.vertex);
        let fcode = preCompile(offScreen.fragment);

        this.program = Compiler.compileProgram(gl,vcode,fcode);
    }
}


export {Material,BasicMaterial,LambertMaterial,HelperMaterial,OffScreenMaterial}

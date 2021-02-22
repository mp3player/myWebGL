import Compiler from './compiler.js'

export default class Texture {
    constructor(src){
        this.width = 0;
        this.height = 0;
        this.tbo = null;
        this.img = null;
        if(src){
            this.load(src);
            this.src = src;
        }
    }
    load(src){
        this.src = src;
        this.img = new Image()
        this.img.onload = () => {
            this.width = this.img.width;
            this.height = this.img.height;
        }
        this.img.src = this.src;

    }
    compile(gl){
        if(!this.tbo){
            if(/.png$/.test(this.src))
                this.tbo = Compiler.tboa(gl,this.src);
            else
                this.tbo = Compiler.tbo(gl,this.src);
        }
    }
}

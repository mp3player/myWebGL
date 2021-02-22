


export default class SkyBox{
    constructor(paths=[]){
        this.paths = paths;
        this.tbos = [];
        
    }
    compile(gl){
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);
        for(let i=0;i<this.paths.length;i++){

            //init content
            // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,0,gl.RGB,512,512,0,gl.RGB,gl.UNSIGNED_BYTE,new Uint8Array([1,1,1,1]));

            let img = new Image();

            img.onload = function(){
                gl.bindTexture(gl.TEXTURE_CUBE_MAP,texture);
                gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
                // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_R,gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.REPEAT);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP,null);
            }

            img.src = this.paths[i];
        }
        return texture;
    }
}

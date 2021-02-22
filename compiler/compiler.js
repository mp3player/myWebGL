const SIZEOF_FLOAT = Float32Array.BYTES_PER_ELEMENT;

function compileShader(gl,code,type){
    const shader = gl.createShader(type);

    gl.shaderSource(shader,code)
    gl.compileShader(shader);

    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        console.error((type == gl.VERTEX_SHADER) ? 'vertex : ' : 'fragment : ' + gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

function compileProgram(gl,vCode,fCode){
    const vShader = compileShader(gl,vCode,gl.VERTEX_SHADER);

    const fShader = compileShader(gl,fCode,gl.FRAGMENT_SHADER);

    if(vShader==null || fShader == null){
        return null;
    }
    const program = gl.createProgram();

    gl.attachShader(program,vShader);
    gl.attachShader(program,fShader);

    gl.linkProgram(program);

    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){
        console.error(gl.getProgramInfoLog(program));
        return null;
    }
    return program;
}

function u_mat4(gl=new WebGL2RenderingContext,program,name,mat4){
    const p = gl.getUniformLocation(program,name);
    if(!p){
        // console.warn('mat4 has no property named : ' + name);
    }
    gl.uniformMatrix4fv(p,false,mat4);
}

function u_mat3(gl=new WebGL2RenderingContext,program,name,mat3){
    const p = gl.getUniformLocation(program,name);
    if(!p){
        // console.warn('mat3 has no property named : ' + name);
    }
    gl.uniformMatrix3fv(p,false,mat3);
}

function u_vec4(gl=new WebGL2RenderingContext,program,name,vec4){
    const p = gl.getUniformLocation(program,name);
    if(!p){
        // console.warn('vec4 has no property named : ' + name);
    }
    gl.uniform3fv(p,new Float32Array(vec4));
}

function u_vec3(gl=new WebGL2RenderingContext,program,name,vec3){
    const p = gl.getUniformLocation(program,name);
    if(!p){
        // console.warn('vec3 has no property named : ' + name);
    }
    gl.uniform3fv(p,new Float32Array(vec3));
}

function u_integer(gl=new WebGL2RenderingContext,program,name,integer){
    const p = gl.getUniformLocation(program,name);
    if(!p){
        // console.warn('integer has no property named : ' + name);
    }
    gl.uniform1i(p,integer);
}

function u_float(gl=new WebGL2RenderingContext,program,name,float){
    const p = gl.getUniformLocation(program,name);
    if(!p){
        // console.warn('float has no property named : ' + name);
    }
    gl.uniform1f(p,float);
}

function vao(gl){
    const v = gl.createVertexArray();
    gl.bindVertexArray(v);
    return v;
}

function vbo(gl=new WebGL2RenderingContext,data){
    const buff = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,buff);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);

    return buff;
}

function ebo(gl=new WebGL2RenderingContext,data){
    const buff = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(data),gl.STATIC_DRAW);

    return buff;
}

function tbo(gl=new WebGL2RenderingContext,src){
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,texture);
    //init content
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([1,1,1,1]));

    let img = new Image();

    img.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_R,gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D,null);
    }

    img.src = src;
    return texture;
}

function tboa(gl=new WebGL2RenderingContext,src){
    const tbo = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,tbo);
    //init content
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([1,1,1,1]));

    let img = new Image();

    img.onload = function(){
        gl.bindTexture(gl.TEXTURE_2D,tbo);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,1);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_R,gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D,null);
    }

    img.src = src;
    return tbo;
}

function fbo(gl = new WebGL2RenderingContext,width,height){
    let framebuffer = gl.createFramebuffer();

    // 新建纹理对象作为帧缓冲区的颜色缓冲区对象
    let tbo = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tbo);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, width, height, 0, gl.RGB, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 新建渲染缓冲区对象作为帧缓冲区的深度缓冲区对象
    var depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tbo, 0);
    
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // 检测帧缓冲区对象的配置状态是否成功
    var e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        console.log('Frame buffer object is incomplete: ' + e.toString());
        return;
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    framebuffer.texture = tbo

    return framebuffer
}

function i_index(gl=new WebGL2RenderingContext,data){
    const buff = ebo(gl,data);
    return buff;
}

function i_vec4(gl=new WebGL2RenderingContext,index,vec4){
    let buff = vbo(gl,vec4);
    gl.vertexAttribPointer(index,4,gl.FLOAT,false,0,0)
    gl.enableVertexAttribArray(1);
    gl.bindBuffer(gl.ARRAY_BUFFER,buff);
    // gl.disableVertexAttribArray(index);
}

function i_vec3(gl,index,vec3){
    let buff = vbo(gl,vec3);
    gl.vertexAttribPointer(index,3,gl.FLOAT,false,0,0)
    gl.enableVertexAttribArray(index);
    gl.bindBuffer(gl.ARRAY_BUFFER,buff);
    // gl.disableVertexAttribArray(index);
}

function i_vec2(gl,index,vec2){
    let buff = vbo(gl,vec2);
    gl.vertexAttribPointer(index,2,gl.FLOAT,false,0,0)
    gl.enableVertexAttribArray(index);
    gl.bindBuffer(gl.ARRAY_BUFFER,buff);
    // gl.disableVertexAttribArray(index);
}

function render(gl){


    let a = () => {
        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // requestAnimationFrame(a);
    }
    a();

}


const Compiler = new Object();
Compiler.compileShader = compileShader;
Compiler.compileProgram = compileProgram;
Compiler.u_mat4 = u_mat4;
Compiler.u_mat3 = u_mat3;
Compiler.u_vec4 = u_vec4;
Compiler.u_vec3 = u_vec3;
Compiler.u_integer = u_integer
Compiler.u_float = u_float


Compiler.i_index = i_index;
Compiler.i_vec4 = i_vec4;
Compiler.i_vec3 = i_vec3;
Compiler.i_vec2 = i_vec2;

Compiler.vao = vao;
Compiler.vbo = vbo;
Compiler.ebo = ebo;
Compiler.tbo = tbo;
Compiler.tboa = tboa;
Compiler.fbo = fbo;

Compiler.render = render;

export default Compiler;

export {
    compileShader,
    compileProgram
}

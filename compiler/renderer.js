import Compiler from '../compiler/compiler'
import Display from './display.js'

class Renderer{
    constructor(canvas){
        this.canvas = canvas;
        this.gl = this.canvas.getContext('webgl2');
        this.display = new Display();
    }
    render(scene,camera){
        let gl = this.gl;
        camera.render();

        let fbo = null;

        if(!camera.renderToScreen){
            fbo = Compiler.fbo(gl,this.canvas.width,this.canvas.width);
            gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
            camera.renderTarget = fbo;
        }

        scene.helper.forEach(d => {
            d.render(gl,camera)
        })
        scene.objs.forEach((o,i) => {
            if(o.material.program){
                gl.useProgram(o.material.program);
                if(o.material.type != 'basic' && o.material.type != 'helper'){
                    let ambient_index = 0;
                    let direction_index = 0;
                    let spot_index = 0;
                    let point_index = 0;
                    scene.light.forEach((l) => {
                        // console.log()
                        switch(l.name){
                            case 'ambient':{
                                Compiler.u_vec3(gl,o.material.program,'ambient_light_' + ambient_index + '.color',l.color);
                                Compiler.u_float(gl,o.material.program,'ambient_light_' + ambient_index + '.intensity',l.intensity);
                                ++ambient_index;
                            }break;
                            case 'directional':{
                                l.compile()
                                Compiler.u_vec3(gl,o.material.program,'directional_light_' + direction_index + '.color',l.color);
                                Compiler.u_float(gl,o.material.program,'directional_light_' + direction_index + '.intensity',l.intensity);
                                Compiler.u_vec3(gl,o.material.program,'directional_light_' + direction_index + '.direction',l.direction);
                                ++direction_index;
                            }break;
                            case 'spot' : {
                                l.compile();
                                Compiler.u_vec3(gl,o.material.program,'spot_light_' + spot_index + '.color',l.color);
                                Compiler.u_float(gl,o.material.program,'spot_light_' + spot_index + '.intensity',l.intensity);
                                Compiler.u_vec3(gl,o.material.program,'spot_light_' + spot_index + '.position',l.position);
                                Compiler.u_vec3(gl,o.material.program,'spot_light_' + spot_index + '.target',l.lookAt);
                                Compiler.u_vec3(gl,o.material.program,'spot_light_' + spot_index + '.direction',l.direction);
                                Compiler.u_float(gl,o.material.program,'spot_light_' + spot_index + '.scale',l.scale);
                                ++spot_index;
                            }break;
                            case 'point' : {
                                Compiler.u_vec3(gl,o.material.program,'point_light_' + point_index + '.color',l.color);
                                Compiler.u_vec3(gl,o.material.program,'point_light_' + point_index + '.position',l.position);
                                Compiler.u_float(gl,o.material.program,'point_light_' + point_index + '.intensity',l.intensity);
                            }break;
                        }
                    })
                }
            }

            o.render(gl,camera);
        })

        gl.bindFramebuffer( gl.FRAMEBUFFER, null);
    }
}
export default Renderer;

export default class Scene {
    constructor(){
        this.objs = [];
        this.light = [];
        this.helper = [];
    }
    add(obj){
        console.log(obj.type)
        switch(obj.type){
            case 'light':{
                this.light.push(obj);
            }break;
            case 'mesh':{
                this.objs.push(obj);
            }break;
            case 'helper':{
                this.helper.push(obj)
            }
        }
        console.log(this)
    }

}

import Mesh from './mesh'
import {BasicMaterial} from './material.js'

class ObjLoader {
    load(url,cb){
        fetch(url)
            .then(d => d.text())
            .then(d => {
                let o = this.parse(d);
                cb(o);
            })
    }
    parse(d){
        const p_explanatory = /^#/;     //explanatory
        const p_position = /^v /;       //position
        const p_normal = /^vn /;        //normal
        const p_uv = /^vt /;            //uv
        const p_face = /^f /;           //index

        const obj = new Mesh(
            new BasicMaterial({
                color:[0,0,1]
            })
        );
        let res = d.split('\n');

        let position = [];
        let normal = [];
        let uv = [];
        let index = [];

        res.forEach(d => {
            if(p_explanatory.test(d)){
                d = d.replace('#','');
            }
            else if(p_position.test(d)){
                d = d.replace(/v /g,'').split(/\s/);
                let arr = [Number(d[0]),Number(d[1]),Number(d[2])]
                position.push(arr)
            }
            else if(p_normal.test(d)){
                d = d.replace(/vn /g,'').split(/\s/);
                let arr = [Number(d[0]),Number(d[1]),Number(d[2])]
                normal.push(arr);
            }
            else if(p_uv.test(d)){
                d = d.replace(/vt /g,'').split(/\s/);
                let arr = [Number(d[0]),Number(d[1])];
                uv.push(arr);
            }
            else if(p_face.test(d)){
                d = d.replace(/f /g,'').split(/[\s]/);
                let pi = [];
                let ui = [];
                let ni = [];
                d.forEach(e => {
                    e = e.split(/\//);

                    pi.push(Number(e[0]) - 1);
                    ui.push(Number(e[1]) - 1);
                    ni.push(Number(e[2]) - 1);
                })
                index.push({pi,ui,ni})
            }

        })
        let p = [];
        let u = [];
        let n = []
        for(let i in index){
            let vertex = index[i].pi;
            let textureCoord = index[i].ui;
            let normalCoord = index[i].ni;

            p = p.concat(position[vertex[0]])
            p = p.concat(position[vertex[1]])
            p = p.concat(position[vertex[2]])

            u = u.concat(uv[textureCoord[0]])
            u = u.concat(uv[textureCoord[1]])
            u = u.concat(uv[textureCoord[2]])

            n = n.concat(normal[normalCoord[0]])
            n = n.concat(normal[normalCoord[1]])
            n = n.concat(normal[normalCoord[2]])
        }

        position = p;
        normal = n;
        uv = u;
        obj.setPosition(position);
        obj.setNormal(normal);
        obj.setUv(uv);

        //tb矩阵
        let ps = {vertex:[],uv:[]}
        for(let i=0;i<position.length / 3;i++){//per vertex
            ps.vertex.push([position[i * 3],position[i * 3 + 1],position[i * 3 + 2]])

        }
        for(let i=0;i<uv.length / 2;i++){
            ps.uv.push([uv[i * 2],uv[i * 2 + 1]])
        }
        console.log(ps.uv)
        let ts = [];
        let bs = [];


        // obj.tangant = ts;
        // obj.bitangant = bs;
        return obj;
    }
}

export default ObjLoader;

export {ObjLoader,Mesh}

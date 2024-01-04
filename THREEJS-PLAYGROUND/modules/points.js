import * as THREE from 'three';
import {animate} from './base.js'
export function points(scene,radius,count){
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.MeshBasicMaterial({vertexColors: true})
    const positions = [];
    const colors = [];
    const sizes = []
    let frag1 = Math.PI/count
    let frag2 = (2*Math.PI)/count
    for(let i = 0; i < count;i++){
        let x = radius * Math.sin(frag1 * i) * Math.cos(frag2 * i)
        let y = radius * Math.sin(frag1 * i) * Math.sin(frag2 * i) 
        let z = radius * Math.cos(frag1 * i)
        positions.push(x,y,z);
        colors.push(1,0,0);
        sizes.push(100);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3))
    geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3))
    geometry.setAttribute('size',new THREE.Float32BufferAttribute(sizes,1).setUsage( THREE.DynamicDrawUsage ))
    generateMorphPositions(geometry)
    geometry.computeBoundingSphere();
    const points = new THREE.Points(geometry,material);
    scene.add(points);  
    function generateMorphPositions(geometry){
        const morphPositions = []

        for(let i = 0; i< count;i++){
            let x = 1 * Math.sin(frag1 * i) * Math.cos(frag2 * i)
            let y = 1 * Math.sin(frag1 * i) * Math.sin(frag2 * i) 
            let z = 1 * Math.cos(frag1 * i)
            morphPositions.push(x,y,z);
        }
        const morphTarget = new THREE.Float32BufferAttribute(morphPositions,3)
        morphTarget.name = "target1"
        geometry.morphAttributes.position = [morphTarget]
    }
    return points
}
export function animatePoints(renderer,camera,scene,stats,points,t){
    console.log(t)
    t+= 0.005
    points.morphTargetInfluences[0] = Math.abs(Math.sin(t))
    requestAnimationFrame( () => animatePoints(renderer,camera,scene,stats,points,t) );
    stats.update()
    renderer.render( scene, camera );  
}
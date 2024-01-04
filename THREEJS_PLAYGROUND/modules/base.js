import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
export function init(){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.position.z = 3;
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    document.body.appendChild( renderer.domElement );
    return [scene, camera, renderer];
}
export function statistics(){
    const stats = new Stats()
    document.body.appendChild(stats.dom)
    return stats
}
export function animate(renderer,camera,scene,stats){
    requestAnimationFrame( () => animate(renderer,camera,scene,stats) );
    stats.update()
    renderer.render( scene, camera );  
}
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
import Layer from './Layer3D.mjs'

export default class Layer2D extends Layer {
    constructor({ width, height }) {
        super({ width, height })

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        canvas.width = width;
        canvas.height = height;

        let camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, 0, 30);
        let scene = this.scene

        let texture = new THREE.Texture(canvas)
        let material = new THREE.MeshBasicMaterial({ map: texture });
        texture.needsUpdate = true;
        material.transparent = true;

        let planeGeometry = new THREE.PlaneGeometry(width, height);
        let plane = new THREE.Mesh(planeGeometry, material);
        scene.add(plane);

        this.scene = scene
        this.camera = camera
        this.canvas = canvas
        this.bitmap = context
        this.texture = texture
        this.context = context
    }
    preAnimate(){
        this.bitmap.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    postAnimate(params){
        this.texture.needsUpdate = true;
    }
    addPlugin(plugin) {
        plugin.init(this);
        this.plugins.push(plugin);
    }
}

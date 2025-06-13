import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
export default class Layer3D {
    constructor({ width, height, camera }) {
        this.plugins = []
        this.disposeables = []
        this.scene = new THREE.Scene();
        if (camera) {
            this.camera = camera
        } else {
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.z = 10;
        }
    }
    addPlugin(plugin) {
        this.plugins.push(plugin)
        plugin.init(this)
    }
    dispose() {
        this.disposeables.forEach(disposeable => disposeable.dispose())
        this.plugins.forEach(plugin => plugin.dispose())
    }
    animate(params) {
        if (this.preAnimate) this.preAnimate(params)
        this.plugins.forEach(plugin => {
            if (!plugin.disabled) plugin.animate(params);
        });
        if (this.postAnimate) this.postAnimate(params)
    }
}
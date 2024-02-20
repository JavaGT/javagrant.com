// import three.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export default class Visualiser {
    constructor({ width, height }) {
        this.layers = []
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.autoClear = false;
        this.renderer.setSize(width, height);
        document.body.appendChild(this.renderer.domElement);
    }
    start() {
        this.context = new AudioContext();
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 2048;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);
    }

    stop() {
        this.context.close();
    }

    addLayer(...layers) {
        this.layers.push(...layers);
        this.layers.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)); // support a zIndex
    }

    dispose() {
        this.layers.forEach(layer => layer.dispose());
    }
    
    animate(timestamp = 0) {
        const timedelta = this.time - timestamp;
        // this.analyser.getByteTimeDomainData(this.data);
        this.analyser.getByteFrequencyData(this.data);
        this.params = {
            data: this.data,
            timestamp,
            timedelta
        };
        for (let layer of this.layers) {
            if (layer.clear) layer.clear();
            if (layer.animate) layer.animate(this.params);
            this.renderer.clearDepth();
            this.renderer.render(layer.scene, layer.camera);
        }
        requestAnimationFrame(this.animate.bind(this));
    }




    connectAudioSource(source, playaudio = false) {
        source.connect(this.analyser);
        if (playaudio === true) {
            source.connect(this.context.destination);
        }
    }
    disconnectAudioSource(source) {
        source.disconnect(this.analyser);
        source.disconnect(this.context.destination);
    }
    streamToSource(stream) {
        return this.context.createMediaStreamSource(stream);
    }
    audioElementToSource(element) {
        return this.context.createMediaElementSource(element);
    }
}
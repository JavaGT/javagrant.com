import Plugin3D from '../class/Plugin3D.mjs';
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
export default class Rainbow3D extends Plugin3D {
    constructor() {
        super()
        const geometry = new THREE.BoxGeometry();
        var mat = new THREE.LineBasicMaterial({ color: 0x000000 });
        this.cubes = new Array(100).fill(0).map((x, i) => {
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            let cube = new THREE.Mesh(geometry, material);

            // wireframe
            var geo = new THREE.EdgesGeometry(cube.geometry);
            var wireframe = new THREE.LineSegments(geo, mat);
            wireframe.renderOrder = 1; // make sure wireframes are rendered 2nd
            cube.add(wireframe);
            cube.position.x = i * 2
            return cube
        })
    }
    animate({ timestamp, data }) {
        this.cubes.forEach((cube, i) => {
            cube.scale.y = ((0.5 + (data[i] / 100)) ** 2) * 2
            // cube.scale.y = (1 + ((data[Math.floor(i * 1000 / 100)] - 128) / 128) * 50 + cube.scale.y * 5) / 6
            // cube.position.x = -50 + Math.sin(timestamp / 3000) * 50 - 0.5 + i * 1.01
            let width = 1.05
            let total_width = this.cubes.length * width
            cube.position.x = (total_width - ((timestamp / 100) + (width * i)) % total_width) - total_width / 2//(/ 2 - i * width)
            cube.rotation.x = Math.sin(timestamp / 3000) + i * Math.cos(timestamp / 3000) / 4
            // const dataval = Math.abs(data[Math.floor(i * 1024 / this.cubes.length)] - 128)
            const dataval = (data[Math.floor(i * 1024 / this.cubes.length)] / 100 + cube.scale.y * 1) / 2
            // console.log((dataval * 360) % 360)
            const color = 'hsl(' + Math.floor((dataval * 200) % 360 + timestamp / 100) + ', 100%, 50%)'
            cube.material.color.set(new THREE.Color(color))
        })
    }
    setup(layer) {
        this.cubes.forEach((cube, i) => {
            layer.scene.add(cube);
        })
    }
}
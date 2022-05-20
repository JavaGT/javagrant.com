import Visualiser from './class/Visualiser.mjs'
import Layer3D from './class/Layer3D.mjs'
import Layer2D from './class/Layer2D.mjs'
import Rainbow3D from './plugins/Rainbow3D.mjs';
// import Plugin2 from './class/Plugin2D.mjs';
import PulseSquare from './plugins/PulseSquare2D.mjs';

const width = window.innerWidth
const height = window.innerHeight

const visualiser = new Visualiser({ width, height })

const layer22d = new Layer2D({ width, height })
const plugin221 = new PulseSquare(1.5, 'blue')
const plugin22 = new PulseSquare(1.3, 'cyan')
layer22d.addPlugin(plugin221)
layer22d.addPlugin(plugin22)

const layer = new Layer3D({ width, height })
const plugin = new Rainbow3D()
layer.addPlugin(plugin)

const layer2d = new Layer2D({ width, height })
const plugin2 = new PulseSquare()
layer2d.addPlugin(plugin2)

visualiser.addLayer(layer22d)
visualiser.addLayer(layer)
visualiser.addLayer(layer2d)

document.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    visualiser.start()
    const source = visualiser.streamToSource(stream);
    visualiser.connectAudioSource(source);
    visualiser.animate();
}, { once: true })
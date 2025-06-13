import Sigma from "https://esm.sh/sigma"
import Graph, { MultiGraph } from "https://esm.sh/graphology"
import forceAtlas2 from 'https://esm.sh/graphology-layout-forceatlas2';
import FA2Layout from "https://esm.sh/graphology-layout-forceatlas2/worker";
import showdown from "https://esm.sh/showdown"

const converter = new showdown.Converter()
const floating_element = document.getElementById('floating')
const dataview = document.getElementById('dataview')
const data_path = './data-out.json'

function person2node(person) {
    return [person.id, { x: Math.random() * 5000, y: Math.random() * 5000, label: person.name, size: 1, color: 'rgb(255, 0, 0)' }]
}

function clamp(min, max, value, round = false) {
    if (round) {
        return Math.round(Math.min(max, Math.max(min, value)))
    }
    return Math.min(max, Math.max(min, value))
}

function toColor(...rgba) {
    if (rgba.length === 3) rgba.push(1)
    return `rgb(${rgba.map(v => clamp(0, 255, v, true)).join(', ')})`
}

// Create graph interface
// let paused = true
// const pause_button = document.createElement('button')
// pause_button.innerText = paused ? 'play' : 'pause'
// document.body.insertBefore(pause_button, document.body.firstChild);

const button = document.createElement('button')
button.innerText = 'Start layout ▶'
floating.insertBefore(button, floating.firstChild);

const graph_element = document.createElement('div')
graph_element.id = 'sigma-container'
document.body.appendChild(graph_element)

///////////////////////////
// Get data
///////////////////////////
const data = await fetch(data_path).then(res => res.json())

//////////////////////////
// create graph
//////////////////////////
const graph = new MultiGraph();
// const renderer = new Sigma(graph, graph_element);

// const fa2Button = document.createElement('button');
// fa2Button.innerHTML = `Start layout ▶`;
// fa2Button.addEventListener('click', toggleFA2Layout);
//insert button at top
// document.body.insertBefore(fa2Button, document.body.firstChild);
// const sensibleSettings = forceAtlas2.inferSettings(graph);
// const fa2Layout = new FA2Layout(graph, {
//     settings: sensibleSettings,
// });
// function toggleFA2Layout() {
//     if (fa2Layout.isRunning()) {
//         fa2Layout.stop();
//         fa2Button.innerHTML = `Start layout ▶`;
//     } else {
//         fa2Layout.start();
//         fa2Button.innerHTML = `Stop layout ⏸`;
//     }
// }
// fa2Button.addEventListener("click", toggleFA2Layout);

// // Cheap trick: tilt the camera a bit to make labels more readable:
// renderer.getCamera().setState({
//     angle: 0.2,
// });


// pause_button.addEventListener('click', () => {
//     paused = !paused
//     if (!paused) {
//         layout.start();
//     } else {
//         console.log(layout)
//         layout.assign(graph)
//         layout.stop();
//     }
//     pause_button.innerText = paused ? 'play' : 'pause'
// })

//////////////////////////
// add nodes
//////////////////////////
Object.entries(data.people).forEach(([id, person]) => {
    graph.addNode(...person2node(person))
})
Object.entries(data.texts).forEach(([id, text]) => {
    text.authors.forEach((author) => {
        graph.updateNodeAttributes(author.id, attr => {
            const num_collab_papers = (attr?.num_collab_papers ? attr.num_collab_papers : 0) + 1
            return {
                ...attr,
                num_collab_papers: num_collab_papers
            };
        })
        text.authors.forEach((author2) => {
            if (author !== author2) {
                graph.addEdge(author.id, author2.id)
                    // graph.addNode('Martha', { occurrences: 36, eyes: 'blue' });
                    ;[author.id, author2.id].forEach((id) => {
                        graph.updateNodeAttributes(id, attr => {
                            const num_collaborators = (attr?.num_collaborators ? attr.num_collaborators : 0) + 1
                            const size = 1 + attr.num_collab_papers * 0.6
                            const r = clamp(0, 255, (num_collaborators - 6) * 30)
                            const g = 0
                            // const g = clamp(0, 100, (size + 2) * 30)
                            const b = 255 - r
                            const color = toColor(r, g, b)
                            return {
                                ...attr,
                                num_collaborators,
                                size,
                                color
                            };
                        });
                    })
            }
        })
    })
})

//////////////////////////
// remove unconnected nodes
//////////////////////////

function filterSingles() {
    // graph.filterNodes(x => x.size === 1).forEach((id) => graph.dropNode(id))
    // graph.filterNodes(x => graph.getNodeAttribute(x, 'size') === 1).forEach((id) => graph.dropNode(id))
    // graph.filterNodes(x => graph.getNodeAttribute(x, 'size') === 1).forEach((id) => graph.setAttribute('hidden', true))
    graph.nodes().forEach(function (node) {
        // if (graph.getNodeAttribute(node, 'size') === 1) graph.setNodeAttribute(node, 'hidden', true)
        if (graph.getNodeAttribute(node, 'size') === 1) graph.dropNode(node)
    });
}
// filterSingles()
const singles_button = document.createElement('button')
singles_button.innerText = 'Remove singles'
singles_button.addEventListener('click', filterSingles)
floating.insertBefore(singles_button, floating.firstChild);

// console.log(graph.filterNodes(x => graph.getNodeAttribute(x, 'size') === 1))



// const sim_options = {
//     iterations: 100,
//     settings: {
//         barnesHutOptimize: true,
//         barnesHutTheta: 0.5,
//         // scalingRatio: 0.1,
//         // strongGravityMode: true,
//         gravity: 80,
//         slowDown: 100,
//         // outboundAttractionDistribution: true,
//         // adjustSizes: true,
//         // edgeWeightInfluence: 0,
//         // linLogMode: false
//     }
// }
// console.log(sim_options)
// pause_button.addEventListener('click', (e) => {
//     // if alt key is pressed)
//     if (e.altKey) {
//         forceAtlas2.assign(graph, { ...sim_options, iterations: 1000 })
//     } else {
//         forceAtlas2.assign(graph, sim_options)
//     }
// })



startrender()
function startrender() {
    const container = graph_element
    const renderer = new Sigma(graph, container, {
    });


    const fa2Button = button;
    const sensibleSettings = forceAtlas2.inferSettings(graph);
    // sensibleSettings.slowDown = 100
    // sensibleSettings.scalingRatio = 0.1
    sensibleSettings.strongGravityMode = true
    sensibleSettings.gravity = 1
    console.log(sensibleSettings)
    const fa2Layout = new FA2Layout(graph, {
        settings: sensibleSettings,
    });
    function toggleFA2Layout() {
        if (fa2Layout.isRunning()) {
            fa2Layout.stop();
            fa2Button.innerHTML = `Start layout ▶`;
        } else {
            fa2Layout.start();
            fa2Button.innerHTML = `Stop layout ⏸`;
        }
    }
    fa2Button.addEventListener("click", toggleFA2Layout);

    // Cheap trick: tilt the camera a bit to make labels more readable:
    renderer.getCamera().setState({
        angle: 0.2,
    });

    renderer.on("downNode", (e) => {
        if (e.event.original.altKey) {
            window.open(`https://scholar.google.co.nz${data.people[e.node].url}`)
        }
        // dataview.innerHTML = converter.makeHtml(`# ${data.people[e.node].name}`)
        dataview.innerHTML = `<code>Google Scholar data: ${JSON.stringify(data.people[e.node], null, 2)}
Node Attributes: ${JSON.stringify(graph.getNodeAttributes(e.node), null, 2)}</code>`
        // isDragging = true;
        // draggedNode = e.node;
        // graph.setNodeAttribute(draggedNode, "highlighted", true);
        console.log(e.node)
        console.log(graph.getNodeAttributes(e.node))
    });
}
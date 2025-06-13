import Sigma from "https://esm.sh/sigma"
import Graph from "https://esm.sh/graphology"
import forceAtlas2 from 'https://esm.sh/graphology-layout-forceatlas2';


const starting_pos_vary = 200

const button = document.createElement('button')
button.innerText = 'go'
document.body.insertBefore(button, document.body.firstChild);

// document.body.appendChild(button)
button.addEventListener('click', () => {
    forceAtlas2.assign(graph, {
        iterations: 300,
        settings: {
            // barnesHutOptimize: true,
            // barnesHutTheta: 0.5,
            scalingRatio: 0.1,
            // strongGravityMode: true,
            gravity: 50,
            slowDown: 100,
            // outboundAttractionDistribution: true,
            // adjustSizes: true,
            // edgeWeightInfluence: 0,
            // linLogMode: false
        }
    })
})


const container = document.getElementById("sigma-container");

const graph = new Graph();


const renderer = new Sigma(graph, container);

const data = await (await fetch('./cites.json')).json()
const nodes = {}

Object.entries(data).forEach(([key, value]) => {
    value.forEach((v) => {
        if (!nodes[v.scholar_id]) {
            nodes[v.scholar_id] = 0
        }
        nodes[v.scholar_id]++
    })
})

Object.entries(data).forEach(([key, value]) => {
    if (!nodes[key]) {
        nodes[key] = true
        // let r = Math.min(value.length / 1.3, 255)
        // let g = Math.min(value.length / 1.2, 180)
        let b = 255 - Math.min(value.length, 255)
        let r = Math.min(value.length, 255)
        let g = 0
        let rgb = `rgb(${r}, ${g},${b})`
        graph.addNode(key, { scholar_id: key, x: Math.random() * starting_pos_vary, y: Math.random() * starting_pos_vary, label: key, size: 10, color: rgb, main: true })
    }
    value.forEach(x => {
        if (x.scholar_id) {
            if (nodes[x.scholar_id] !== true && nodes[x.scholar_id] > 1) {
                // const hsl = `hsl(0, ${Math.floor((1 - (1 / nodes[x.scholar_id])) * 100)}%, 50%)`c
                // const r = Math.floor((1 - (1 / (nodes[x.scholar_id] / 2))) * 255)
                // const g = Math.floor((1 - (1 / (nodes[x.scholar_id] / 3))) * 255)
                // const b = Math.floor((1 - (1 / (nodes[x.scholar_id] / 0.5))) * 255)
                const r = 255 - (nodes[x.scholar_id] * 30)
                const g = 255 - (nodes[x.scholar_id] * 80)
                const b = 255 - (nodes[x.scholar_id] * 50)
                const rgb = `rgb(${r}, ${g}, ${b})`
                graph.addNode(x.scholar_id, { scholar_id: x.scholar_id, x: Math.random() * starting_pos_vary, y: Math.random() * starting_pos_vary, label: nodes[x.scholar_id] + ': ' + x.title, size: nodes[x.scholar_id] ** 1.2, color: rgb })
                nodes[x.scholar_id] = true
            }
            try {
                graph.addEdge(key, x.scholar_id)
            } catch (e) {
                // console.log(e)
            }
        }
    })
})


const state = {}

// Bind graph interactions:
renderer.on("enterNode", ({ node }) => {
    if (graph.getNodeAttribute(node, 'main')) {
        state.hovered_node = node
        state.hovered_neighbors = new Set(graph.neighbors(node));
    }

    renderer.refresh();
});
renderer.on("leaveNode", () => {
    state.hovered_node = undefined
    state.hovered_neighbors = undefined

    renderer.refresh();
});

renderer.setSetting("nodeReducer", (node, data) => {
    const res = { ...data };

    if (state.hovered_neighbors && !state.hovered_neighbors.has(node) && state.hovered_node !== node) {
        res.label = "";
        res.color = "#f6f6f6";
    }

    if (state.selectedNode === node) {
        res.highlighted = true;
    } else if (state.suggestions && !state.suggestions.has(node)) {
        res.label = "";
        res.color = "#f6f6f6";
    }

    return res;
});

renderer.setSetting("edgeReducer", (edge, data) => {
    const res = { ...data };

    if (state.hovered_node && !graph.hasExtremity(edge, state.hovered_node)) {
        res.hidden = true;
    }

    if (state.suggestions && (!state.suggestions.has(graph.target(edge)))) {
        res.hidden = true;
    }

    return res;
});

let isDragging = false;
let draggedNode = null;

renderer.on("downNode", (e) => {
    if (e.event.original.altKey) {
        window.open(`https://scholar.google.co.nz/scholar?cites=${graph.getNodeAttribute(e.node, 'scholar_id')}&as_sdt=2005&sciodt=0,5&hl=en`)
    }
    isDragging = true;
    draggedNode = e.node;
    graph.setNodeAttribute(draggedNode, "highlighted", true);
});

// On mouse move, if the drag mode is enabled, we change the position of the draggedNode
renderer.getMouseCaptor().on("mousemovebody", (e) => {
    if (!isDragging || !draggedNode) return;

    // Get new position of node
    const pos = renderer.viewportToGraph(e);

    graph.setNodeAttribute(draggedNode, "x", pos.x);
    graph.setNodeAttribute(draggedNode, "y", pos.y);

    // Prevent sigma to move camera:
    e.preventSigmaDefault();
    e.original.preventDefault();
    e.original.stopPropagation();
});

// On mouse up, we reset the autoscale and the dragging mode
renderer.getMouseCaptor().on("mouseup", () => {
    if (draggedNode) {
        graph.removeNodeAttribute(draggedNode, "highlighted");
    }
    isDragging = false;
    draggedNode = null;
});

// Disable the autoscale at the first down interaction
renderer.getMouseCaptor().on("mousedown", () => {
    if (!renderer.getCustomBBox()) renderer.setCustomBBox(renderer.getBBox());
});

// graph.addNode("John", { x: 0, y: 10, size: 5, label: "John", color: "blue" });
// graph.addNode("Mary", { x: 10, y: 0, size: 3, label: "Mary", color: "red" });

// graph.addEdge("John", "Mary");
const canvas = document.createElement('canvas')
const c = canvas.getContext('2d')
canvas.width = 500
canvas.height = 500

document.querySelector('#canvas').appendChild(canvas)


class Vector extends Array {
    constructor(...params) {
        super(...params)
    }
    get x() {
        return this[0]
    }
    get y() {
        return this[1]
    }
    get z() {
        return this[2]
    }
    times(vec2) {
        if (!isNaN(vec2)) {
            return new Vector(this[0] * vec2, this[1] * vec2, this[2] * vec2)
        } else {
            return new Vector(this[0] * vec2[0], this[1] * vec2[1], this[2] * vec2[2])
        }
    }
    div(vec2) {
        if (!isNaN(vec2)) {
            return new Vector(this[0] / vec2, this[1] / vec2, this[2] / vec2)
        } else {
            return new Vector(this[0] / vec2[0], this[1] / vec2[1], this[2] / vec2[2])
        }
    }
    add(vec2) {
        if (!isNaN(vec2)) {
            return new Vector(this[0] + vec2, this[1] + vec2, this[2] + vec2)
        } else {
            return new Vector(this[0] + vec2[0], this[1] + vec2[1], this[2] + vec2[2])
        }
    }
    mod(vec2) {
        if (!isNaN(vec2)) {
            return new Vector(this[0] % vec2, this[1] % vec2, this[2] % vec2)
        } else {
            return new Vector(this[0] % vec2[0], this[1] % vec2[1], this[2] % vec2[2])
        }
    }
    vary(value) {
        return new Vector(this[0] + (Math.random() * 2 - 1) * value, this[1] + (Math.random() * 2 - 1) * value, this[2] + (Math.random() * 2 - 1) * value)
    }
    cap(value) {
        return this.map(x => Math.min(x, value))
    }
    dist(vec2) {
        return (this[0] - vec2[0]) ** 2 + (this[1] - vec2[1]) ** 2 + ((this[2] || 0) - (vec2[2] || 0)) ** 2
    }
}

class World {
    constructor() { }
    render(ctx) {
        ctx.fillStyle = 'rgba(255,255,255,0.3)'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        this.items.forEach(item => {
            item.render(ctx)
        })
    }
    update(difference) {
        this.items.forEach(item => {
            item.update(difference, this)
        })
    }
    items = []
}

class Orb {
    constructor(world) {
        this.pos = new Vector(Math.random(), Math.random())
        this.velocity = new Vector(Math.random(), Math.random()).div(1)
        this.varyRate = Math.random() / 1000
    }
    render(ctx) {
        ctx.fillStyle = 'black'
        ctx.fillRect(this.pos.x * ctx.canvas.width, this.pos.y * ctx.canvas.height, 10, 10)
    }
    update(mschange, world) {
        world.items.forEach(item => {
            if (item != this) {
                const dist = this.pos.dist(item.pos)
                this.velocity = this.velocity.add(item.velocity.div(Math.sqrt(dist)/10000000000)).div(world.items.length)
                console.log(item.velocity)
                // this.velocity = this.velocity.add(item.velocity.div(this.pos.dist(item.pos)).div(world.items.length))
                //item.velocity.div(this.pos.dist(item.pos) * 1)).div(world.items.length)
            }
        })
        this.velocity = this.velocity.vary(this.varyRate)
        this.pos = this.pos.add(this.velocity).mod(1)
        // console.log(this.velocity)
    }
}




const world = new World()
world.items.push(new Orb())
world.items.push(new Orb())


const ctx = canvas.getContext('2d')
let oldt = Date.now()
render()

function render(t = Date.now()) {
    window.requestAnimationFrame(render)
    const delta = t - oldt
    oldt = t
    world.update(delta)
    world.render(ctx)
}
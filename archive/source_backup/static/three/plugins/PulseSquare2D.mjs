import Plugin2D from '../class/Plugin2D.mjs';
export default class PulseSquare extends Plugin2D {
    constructor(scale, color) {
        super()
        this.scale = scale || 1
        this.color = color || 'white'
    }
    animate({ data }) {
        const ctx = this.context
        ctx.fillStyle = this.color
        ctx.lineWidth = 10
        const size = (data[0] / 10) ** 2 * this.scale
        const cx = ctx.canvas.width / 2
        const cy = ctx.canvas.height / 2
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size)
    }
}
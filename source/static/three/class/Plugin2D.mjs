import Plugin from './Plugin.mjs';
export default class Plugin2D extends Plugin {
    constructor() {
        super()
    }
    animate({ timestamp, timedelta, data }) {

    }
    get width() {
        return this.context.canvas.width
    }
    get height() {
        return this.context.canvas.height
    }
    get context() {
        return this.layer.context
    }
}
export default class Plugin {
    constructor() {
        this.disabled = false
        this.disposeables = []
    }
    dispose() {
        this.disposeables.forEach(disposeable => disposeable.dispose())
    }
    init(layer) {
        this.layer = layer
        if (this.setup) this.setup(layer)
    }
}

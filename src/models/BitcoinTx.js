import TxView from './TxView.js'

export default class BitcoinTx {
  constructor ({ version, id, value, inputs, outputs, witnesses, time, block }, vertexArray) {
    this.version = version
    this.id = id
    this.vertexArray = vertexArray

    if (inputs && outputs) {
      this.inputs = inputs
      this.outputs = outputs
      this.value = this.calcValue()
    } else if (value) {
      this.value = value
    }

    this.witnesses = witnesses
    this.time = time

    this.setBlock(block)
    this.view = new TxView(this)
  }

  destroy () {
    if (this.view) this.view.destroy()
  }

  calcValue () {
    if (this.outputs && this.outputs.length) {
      return this.outputs.reduce((acc, output) => {
        return acc + output.value
      }, 0)
    } else return 0
  }

  setBlock (block) {
    this.block = block
    this.state = this.block ? 'block' : 'pool'
  }

  updateView (update) {
    if (this.view) this.view.update(update)
  }

  setPosition (position) {
    this.position = position
  }

  getPosition () {
    if (this.position) return this.position
  }
}

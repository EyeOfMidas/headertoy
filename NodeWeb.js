import FloatyNode from "./FloatyNode.js"

export class NodeWeb {
	initialize() {
		this.gridSize = { width: 32, height: 32 }
		this.gridMaxSize = { width: 10, height: 10 }
		this.resize()
		this.elapsed = 0
		this.cursorPosition = { x: 0, y: 0 }
	}

	resize() {
		this.container = document.getElementById("headertoy")
		this.gridMaxSize.width = Math.ceil(this.container.clientWidth / this.gridSize.width)
		this.gridMaxSize.height = Math.ceil(this.container.clientHeight / this.gridSize.height)

		this.nodes = []
		for (let y = 0; y < 2 * this.gridMaxSize.height; y++) {
			for (let x = 0; x < 2 * this.gridMaxSize.width; x++) {
				this.nodes.push(new FloatyNode(this, x, y, this.gridSize))
			}
		}
	}

	update() {
		this.elapsed++
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].update()
		}

	}

	draw(context) {
		context.fillStyle = "rgb(48,48,48)"
		context.save()
		context.translate(this.gridMaxSize.width, this.gridMaxSize.height)
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].draw(context)
		}

		context.restore()
	}

	onMouseMove(cursorPosition) {
		this.cursorPosition = cursorPosition
	}
}
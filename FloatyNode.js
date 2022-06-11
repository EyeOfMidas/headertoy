const TAU = 2 * Math.PI
export default class FloatyNode {
	constructor(web, gridPositionX, gridPositionY, gridSize) {
		this.web = web
		this.gridPosition = { x: gridPositionX, y: gridPositionY }
		this.offsetPosition = {x: 0, y: 0}
		this.gridSize = gridSize
		this.nodeSize = 4
		this.amplitude = 8
		this.period = 1/100
	}

	update() {
		this.offsetPosition.y = this.amplitude * Math.sin((this.web.elapsed * this.period) + (this.gridPosition.x))
		this.offsetPosition.x = this.amplitude * Math.sin((this.web.elapsed * this.period) + (this.gridPosition.y))
	}

	draw(context) {
		context.save()
		context.translate(
			this.gridPosition.x * this.gridSize.width - (this.gridSize.width / 2),
			this.gridPosition.y * this.gridSize.height - (this.gridSize.height / 2)
		)
		context.beginPath()
		context.arc(this.offsetPosition.x, this.offsetPosition.y, this.nodeSize, 0, TAU)
		context.fill()
		context.restore()
	}
}
const TAU = 2 * Math.PI
export default class FloatyNode {
	constructor(web, gridPositionX, gridPositionY, gridSize) {
		this.web = web
		this.gridPosition = { x: gridPositionX, y: gridPositionY }
		this.gridSize = gridSize
		this.initialPosition = {
			x: this.gridPosition.x * this.gridSize.width - (this.gridSize.width / 2),
			y: this.gridPosition.y * this.gridSize.height - (this.gridSize.height / 2)
		}
		this.offsetPosition = { x: 0, y: 0 }
		this.nodeSize = 4
		this.amplitude = 8
		this.period = 1 / 100
		this.warpDistance = 256
		this.warpAmount = 16
	}

	angle = (pos1, pos2) => Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x)
	distance = (pos1, pos2) => Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))

	update() {
		let distance = this.distance(this.web.cursorPosition, this.initialPosition)
		let angle = this.angle(this.web.cursorPosition, this.initialPosition)
		let directionToCursor = { x: Math.cos(angle), y: Math.sin(angle) }

		this.offsetPosition.y = this.amplitude * Math.sin((this.web.elapsed * this.period) + (this.gridPosition.x))
		this.offsetPosition.x = this.amplitude * Math.sin((this.web.elapsed * this.period) + (this.gridPosition.y))
		if (distance < this.warpDistance) {
			let magnitude = (this.warpDistance - distance) / this.warpDistance
			this.offsetPosition.x += this.warpAmount * magnitude * directionToCursor.x
			this.offsetPosition.y += this.warpAmount * magnitude * directionToCursor.y
		}
	}

	draw(context) {
		context.save()
		context.translate(this.initialPosition.x, this.initialPosition.y)
		context.beginPath()
		context.arc(this.offsetPosition.x, this.offsetPosition.y, this.nodeSize, 0, TAU)
		context.fill()
		context.restore()
	}
}
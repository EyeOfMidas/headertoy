window.addEventListener("resize", resize);
window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

document.addEventListener("DOMContentLoaded", event => {
	var container = document.getElementById("header");
	canvas = document.createElement("canvas")
	canvas.style.width = "100%"
	canvas.style.height = "100%"
	canvas.id = "headertoy"
	container.appendChild(canvas)
	context = canvas.getContext('2d');

	init();
	animate();
});

var canvas;
var context;
var animId;
var keys = [];

var starsNear = [];
var starsFar = [];

var ship = {
	x: 0,
	y: 0,
	angle: -90,
	acceleration: { x: 0, y: 0 },
	velocity: { x: 0, y: 0 },
	width: 20,
	height: 30,
	rotationSpeed: 3,
	thrust: 0.2,
	bulletSpeed: 2,
	life: 3,
	score: 0,
};

var bullets = [];
var shootDelay = 0;
var asteroids = [];

function init() {
	for (let i = 0; i < 256; i++) {
		keys[i] = false;
	}

	resize();

	//initialize the game objects here
	initializeStars();
	initializeAsteroids();
	initializeShip();
	initializeBullets();
}

function resize() {
	let dpi = window.devicePixelRatio;
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	context.width = canvas.clientWidth / dpi;
	context.height = canvas.clientHeight / dpi;
}

function animate() {
	update();
	context.save();
	context.translate(0.5, 0.5);
	clearFrame(context);
	draw(context);
	context.restore();
	animId = requestAnimationFrame(animate, canvas);
}

function clearFrame(context) {
	context.fillStyle = "#000000";
	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fill();
}

function update() {
	//update the game objects here
	updateStars();
	updateAsteroids();
	updateBullets();
	updateShip();

}

function draw(context) {
	//draw the game objects here
	drawStars(context);
	drawAsteroids(context);
	drawShip(context);
	drawBullets(context);

	drawUI(context);
}

function rand(min, max) {
	return max * Math.random() + min;
}

function doesCollide(mobile1, mobile2) {
	let distance = Math.sqrt(
		Math.pow(mobile1.x - mobile2.x, 2) +
		Math.pow(mobile1.y - mobile2.y, 2)
	)
	return mobile2.width / 2 >= distance - mobile1.width / 2;
}

function wrapAround(mobile) {
	if (mobile.x - mobile.width / 2 > canvas.width) { // too far right
		mobile.x = -mobile.width / 2;
	} else if (mobile.x + mobile.width / 2 <= 0) { // too far left
		mobile.x = canvas.width + mobile.width / 2;
	}

	if (mobile.y - mobile.height / 2 > canvas.height) { // too far down
		mobile.y = -mobile.height / 2;
	} else if (mobile.y + mobile.height / 2 <= 0) { // too far up
		mobile.y = canvas.height + mobile.height / 2;
	}
}

function getRandomPositionOnScreen() {
	let position = {};
	position.x = Math.floor(rand(0, canvas.width));
	position.y = Math.floor(rand(0, canvas.height));
	return position;
}

function getShipAnglePosition() {
	let shipAnglePosition = {};
	shipAnglePosition.x = Math.cos(ship.angle * (Math.PI / 180));
	shipAnglePosition.y = Math.sin(ship.angle * (Math.PI / 180));
	return shipAnglePosition;
}

function shipShape(context) {
	context.moveTo(ship.width / 2, -ship.height / 2);
	context.lineTo(0, ship.height / 2);
	context.lineTo(-ship.width / 2, -ship.height / 2);
	context.lineTo(ship.width / 2, -ship.height / 2);
}

function onKeyDown(event) {
	keys[event.keyCode] = true;
}

function onKeyUp(event) {
	keys[event.keyCode] = false;
}

function initializeStars() {
	starsNear = [];
	starsFar = [];
	for (let i = 0; i < 50; i++) {
		let star = {};
		let position = getRandomPositionOnScreen();
		star.x = position.x;
		star.y = position.y;
		star.width = rand(1, 2);
		star.height = star.width;
		starsNear.push(star);
	}

	for (let i = 0; i < 300; i++) {
		let star = {};
		let position = getRandomPositionOnScreen();
		star.x = position.x;
		star.y = position.y
		star.width = rand(0.1, 2);
		star.height = star.width;
		starsFar.push(star);
	}
}

function updateStars(delta) {
	for (let i = 0; i < starsNear.length; i++) {
		let star = starsNear[i];
		star.x += 0.15;
		star.y += 0.15;
		wrapAround(star);
	}

	for (let i = 0; i < starsFar.length; i++) {
		let star = starsFar[i];
		star.x += 0.05;
		star.y += 0.05;
		wrapAround(star);
	}
}

function drawStars(context) {
	context.fillStyle = "lightgray";
	for (let i = 0; i < starsNear.length; i++) {
		let star = starsNear[i];
		context.save();
		context.translate(star.x, star.y);
		context.beginPath();
		context.arc(0, 0, star.width, 0, 2 * Math.PI);
		context.fill();
		context.restore();
	}

	for (let i = 0; i < starsFar.length; i++) {
		let star = starsFar[i];
		context.save();
		context.translate(star.x, star.y);
		context.beginPath();
		context.arc(0, 0, star.width, 0, 2 * Math.PI);
		context.fill();
		context.restore();
	}
}

function initializeAsteroids() {
	asteroids = [];
	for (let i = 0; i < 2; i++) {
		let randomPosition = getRandomPositionOnScreen();
		let randomVelocity = { x: rand(-1, 2), y: rand(-1, 2) };
		let initialSize = { width: 200, height: 200 };
		let asteroid = createAsteroid(randomPosition, randomVelocity, initialSize);
		asteroids.push(asteroid);
	}
}

function createAsteroid(position, velocity, size) {
	let asteroid = {};
	asteroid.x = position.x;
	asteroid.y = position.y;
	asteroid.width = size.width;
	asteroid.height = size.height;
	asteroid.velocity = {};
	asteroid.velocity.x = velocity.x;
	asteroid.velocity.y = velocity.y;
	return asteroid;
}

function updateAsteroids() {
	for (let i = 0; i < asteroids.length; i++) {
		let asteroid = asteroids[i];
		asteroid.x += asteroid.velocity.x;
		asteroid.y += asteroid.velocity.y;
		wrapAround(asteroid);
	}
}

function drawAsteroids(context) {
	context.strokeStyle = "lightgray";
	context.fillStyle = "gray";
	for (let i = 0; i < asteroids.length; i++) {
		let asteroid = asteroids[i];
		context.save();
		context.translate(asteroid.x, asteroid.y);
		context.beginPath();
		context.arc(0, 0, asteroid.width / 2, 0, 2 * Math.PI);
		context.fill();
		context.stroke();
		context.restore();
	}
}

function initializeShip() {
	ship = {
		x: 0,
		y: 0,
		angle: -90,
		acceleration: { x: 0, y: 0 },
		velocity: { x: 0, y: 0 },
		width: 15,
		height: 20,
		rotationSpeed: 3,
		thrust: 0.2,
		bulletSpeed: 2,
		life: 3,
		score: 0,
	};

	ship.x = canvas.width / 2;
	ship.y = canvas.height / 2;
}

function updateShip() {
	ship.acceleration.x = 0;
	ship.acceleration.y = 0;

	let anglePosition = getShipAnglePosition();

	ship.angle %= 360;

	ship.velocity.x += ship.acceleration.x;
	ship.velocity.y += ship.acceleration.y;

	ship.x += ship.velocity.x;
	ship.y += ship.velocity.y;

	wrapAround(ship);

	for (let j = 0; j < asteroids.length; j++) {
		let asteroid = asteroids[j];
		if (doesCollide(ship, asteroid)) {
			hitShip(asteroid);
			break;
		}
	}
}

function drawShip(context) {
	context.strokeStyle = "red";
	context.fillStyle = "crimson";
	context.save();
	context.translate(ship.x, ship.y);
	context.rotate((ship.angle - 90) * (Math.PI / 180));
	context.beginPath();
	shipShape(context);
	context.fill();
	context.stroke();

	context.restore();
}

function addBullet() {
	shootDelay = 15;
	let anglePosition = getShipAnglePosition();
	let bullet = {};
	bullet.x = ship.x + ((ship.height / 2) * anglePosition.x);
	bullet.y = ship.y + ((ship.height / 2) * anglePosition.y);
	bullet.width = 6;
	bullet.height = 6;
	bullet.velocity = {};
	bullet.velocity.x = ship.bulletSpeed * anglePosition.x + ship.velocity.x;
	bullet.velocity.y = ship.bulletSpeed * anglePosition.y + ship.velocity.y;
	bullet.lifespan = 75;
	bullets.push(bullet);
}

function initializeBullets() {
	bullets = [];
}

function updateBullets() {
	shootDelay--;
	for (let i = 0; i < bullets.length; i++) {
		let bullet = bullets[i];
		bullet.x += bullet.velocity.x;
		bullet.y += bullet.velocity.y;
		bullet.lifespan--;

		for (let j = 0; j < asteroids.length; j++) {
			let asteroid = asteroids[j];
			if (doesCollide(bullet, asteroid)) {
				hitAsteroid(asteroid, bullet);
				break;
			}
		}
		wrapAround(bullet);
	}
	bullets = bullets.filter(bullet => bullet.lifespan > 0);
}

function drawBullets(context) {
	context.fillStyle = "white";
	for (let i = 0; i < bullets.length; i++) {
		let bullet = bullets[i];
		context.save();
		context.translate(bullet.x, bullet.y);
		context.beginPath();
		context.arc(0, 0, bullet.width / 2, 0, 2 * Math.PI);
		context.fill();
		context.restore();
	}
}

function hitAsteroid(asteroid, bullet) {
	bullet.lifespan = 0;
	let asteroidIndex = asteroids.indexOf(asteroid);
	asteroids.splice(asteroidIndex, 1);

	ship.score += asteroid.width * 10;


	if (asteroid.width <= 25) {
		if (asteroids.length == 0) {
			console.log(`You win! Score: ${ship.score}`);
			init();
		}
		return;
	}
	let velocityVariation = {};
	velocityVariation.x = asteroid.velocity.x + rand(-1, 2);
	velocityVariation.y = asteroid.velocity.y + rand(-1, 2);
	let newSize = { width: asteroid.width / 2, height: asteroid.height / 2 };
	asteroids.push(createAsteroid(asteroid, velocityVariation, newSize));
	velocityVariation.x = asteroid.velocity.x + rand(-1, 2);
	velocityVariation.y = asteroid.velocity.y + rand(-1, 2);
	asteroids.push(createAsteroid(asteroid, velocityVariation, newSize));
}

function hitShip(asteroid) {
	ship.life--;
	if (ship.life <= 0) {
		console.log(`You lose! Score: ${ship.score}`);
		init();
		return;
	}
	ship.x = rand(0, canvas.width);
	ship.y = rand(0, canvas.height);
	ship.velocity.x = 0;
	ship.velocity.y = 0;
	ship.acceleration.x = 0;
	ship.acceleration.y = 0;
}

function drawUI(context) {
	context.font = "30px Arial";
	context.textAlign = "left";
	context.fillText(`Lives: ${ship.life}`, 10, 50);
	context.textAlign = "right";
	context.fillText(`Score: ${ship.score}`, canvas.width - 10, 50);
}
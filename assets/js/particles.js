const brightAndTropical = ["#F52549", "#FA6775", "#FFD64D", "#9BC01C"];
const coolBlues = ["#003B46", "#07575B", "#66A5AD", "#C4DFE6"];
const lemonadeStand = ["#F70025", "#F25C00", "#F9A603", "#F29F00"];
const nightLife = ["#00CFFA", "#FF0038", "#FFCE38", "#FFFFFF"];
const brightAndPainterly = ["#061283", "#FD3C3C", "#FFB74C", "#138D90"];

const COLOR_SETS = {
	"Bright and tropical": brightAndTropical,
	"Cool blues": coolBlues,
	"Lemonade stand": lemonadeStand,
	"Night life": nightLife,
	"Bright and painterly": brightAndPainterly,
};

const parameters = {
	autoCreation: true,
	autoCreationDelay: 150,
	particlesCount: 25,
	colors: "Night life",
	particleRadius: 7,
	speed: 6,
	deceleration: 0.017,
	maxLife: 1400,
	creationOnMousedownDelay: 25,
};

const image = document.getElementById("output");
const canvas = document.getElementById("canvas");
const canvasCtx = canvas.getContext("2d");
let particles = [];

function setCanvasSize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
setCanvasSize();
window.addEventListener("resize", setCanvasSize);

class Particle {
	constructor(x, y) {
		const { maxLife, speed, colors, deceleration } = parameters;
		const colorsArray = COLOR_SETS[colors];
		this.framesCount = Math.ceil(maxLife / (1000 / 60));
		this.framesRendered = 0;
		this.opacity = 1;
		this.opacitySpeed = 1 / this.framesCount;
		this.x = x;
		this.y = y;
		this.deceleration = deceleration;
		this.color =
			colorsArray[Math.floor(Math.random() * colorsArray.length)];
		const randomR = random(0, speed);
		const randomTheta = random(0, Math.PI * 2);
		this.speedX = randomR * Math.cos(randomTheta);
		this.speedY = randomR * Math.sin(randomTheta);
		this.radius = parameters.particleRadius;
		this.radiusSpeed = this.radius / this.framesCount;
	}

	frame(canvasCtx) {
		canvasCtx.fillStyle = this.color;
		canvasCtx.globalAlpha = this.opacity;
		canvasCtx.beginPath();
		canvasCtx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		canvasCtx.fill();
		this.opacity -= this.opacitySpeed;
		if (this.opacity < 0) {
			this.opacity = 0;
		}
		this.x += this.speedX;
		this.y += this.speedY;
		this.speedX *= 1 - this.deceleration;
		this.speedY *= 1 - this.deceleration;
		this.radius = this.radius - this.radiusSpeed;
		if (this.radius < 0) {
			this.radius = 0;
		}
		this.framesRendered++;
		return this.framesCount >= this.framesRendered;
	}
}

function particlesFrame() {
	canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
	particles = particles.filter((p) => p.frame(canvasCtx));
	window.requestAnimationFrame(particlesFrame);
}

particlesFrame();

function random(min, max) {
	return min + Math.random() * (max - min);
}

function addParticlesAtPoint(x, y) {
	const newParticles = new Array(parameters.particlesCount)
		.fill(0)
		.map(() => new Particle(x, y));
	particles.push(...newParticles);
}

let shouldAdd = false;

function addParticles() {
	if (shouldAdd) {
		const [width, height] = getSize();
		addParticlesAtPoint(width / 2, height / 2);
	}
	setTimeout(addParticles, parameters.creationOnMousedownDelay);
}

function startAdding() {
	shouldAdd = true;
}

function stopAdding() {
	shouldAdd = false;
}

addParticles();

function getSize() {
	var myWidth = 0,
		myHeight = 0;
	if (typeof window.innerWidth == "number") {
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	} else if (
		document.documentElement &&
		(document.documentElement.clientWidth ||
			document.documentElement.clientHeight)
	) {
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if (
		document.body &&
		(document.body.clientWidth || document.body.clientHeight)
	) {
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}
	return [myWidth, myHeight];
}

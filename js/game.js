(function () {
	var canvas = document.getElementById('game-canvas'),
		canvasContext = canvas.getContext('2d'),
		fps = 30,
		ball,
		paddle;

	const PADDLE_WIDTH = 100;
	const PADDLE_THICKNESS = 10;
	const BALL_RADIUS = 10;

	setInterval(updateAll, 1000 / fps);

	canvas.addEventListener('mousemove', mouseMovedEvent);

	/* Ball Class */
	var Ball = function (x, y, speedX, speedY) {
		this.x  = this.originalX = x;
		this.y = this.originalY = y;
		this.speedX = speedX;
		this.speedY = speedY;
	};

	Ball.prototype.updatePosition = function () {
		this.x += this.speedX;
		this.y += this.speedY;

		// This deals with the screen's edges
		if (this.x - BALL_RADIUS < 0 || this.x + BALL_RADIUS > canvas.width) {
			this.speedX *= -1;
		}
		if (this.y - BALL_RADIUS < 0) {
			this.speedY *= -1;
		}
		if (this.y + BALL_RADIUS > canvas.height) {
			this.reset();
		}
	};

	Ball.prototype.reset = function () {
		this.x  = this.originalX;
		this.y = this.originalY;
	};

	Ball.prototype.draw = function () {
		drawCircle(this.x, this.y, BALL_RADIUS, 'white');
	};
	/* End Ball Class */

	/* Paddle Class */
	var Paddle = function (x, y) {
		this.x = x;
		this.y = y;
	}

	Paddle.prototype.updatePosition = function (x) {
		this.x = x;
	};

	Paddle.prototype.draw = function () {
		drawRectangle(this.x, this.y, PADDLE_WIDTH, PADDLE_THICKNESS, 'white');
	};
	/* End Paddle Class */

	ball = new Ball(canvas.width / 2, canvas.height / 2, 5, 7);
	paddle = new Paddle((canvas.width - PADDLE_WIDTH) / 2, canvas.height - 100);

	/**
	 * EVENT FOR THE MOUSE
	 */
	function mouseMovedEvent (e) {
		var rect = canvas.getBoundingClientRect(),
			root = document.documentElement;

		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		var mouseX = e.clientX - rect.left - root.scrollLeft;

		if (mouseX > PADDLE_WIDTH / 2 && mouseX < canvas.width - PADDLE_WIDTH / 2) {
			paddle.updatePosition(
				Math.min(
					Math.max(
						0,
						mouseX - PADDLE_WIDTH / 2
					),
					canvas.width - PADDLE_WIDTH / 2
				)
			);
		}
	}

	function moveAll () {
		ball.updatePosition();
	}

	/**
	 * Methods to draw stuff
	 */
	function drawRectangle (x, y, width, height, color) {
		canvasContext.fillStyle = color;
		canvasContext.fillRect(x, y, width, height);
	}

	function drawCircle (x, y, radius, color) {
		canvasContext.fillStyle = color;
		canvasContext.beginPath();
		canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
		canvasContext.fill();
	}

	function drawAll () {
		drawRectangle(0, 0, canvas.width, canvas.height, 'black');
		ball.draw();
		paddle.draw();
	}

	function updateAll () {
		moveAll();
		drawAll();
	}
})();

(function () {
	var canvas = document.getElementById('game-canvas'),
		canvasContext = canvas.getContext('2d'),
		fps = 30,
		ball,
		paddle,
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY;

	const PADDLE_WIDTH = 100;
	const PADDLE_THICKNESS = 10;
	const BALL_RADIUS = 10;

	const DEBUG = true;

	setInterval(updateAll, 1000 / fps);

	canvas.addEventListener('mousemove', mouseMovedEvent);

	/* Ball Class */
	var Ball = function (x, y, speedX, speedY) {
		this.x  = this.originalX = x;
		this.y = this.originalY = y;
		this.speedX = this.originalSpeedX = speedX;
		this.speedY = this.originalSpeedY = speedY;
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

		if (this.y + BALL_RADIUS > paddle.y &&
			this.y - BALL_RADIUS < paddle.y + PADDLE_THICKNESS &&
			this.x  + BALL_RADIUS > paddle.x &&
			this.x - BALL_RADIUS < paddle.x + PADDLE_WIDTH
		) {
			this.speedY *= -1;

			var centerPaddleX = paddle.x + PADDLE_WIDTH / 2,
				distFromPaddleCenter = ball.x - centerPaddleX;

			this.speedX = distFromPaddleCenter * 0.35;
		}

	};

	Ball.prototype.reset = function () {
		this.x  = this.originalX;
		this.y = this.originalY;
		this.speedX = this.originalSpeedX;
		this.speedY = this.originalSpeedY;
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

			mouseX = e.clientX - rect.left - root.scrollLeft;
			mouseY = e.clientY- rect.top - root.scrollTop;

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

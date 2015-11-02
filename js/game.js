(function () {
	var canvas = document.getElementById('game-canvas'),
		canvasContext = canvas.getContext('2d'),
		fps = 30,
		ball,
		paddle;

	const PADDLE_WIDTH = 100;
	const PADDLE_THICKNESS = 10;

	setInterval(updateAll, 1000 / fps);

	/* Ball Class */
	var Ball = function (x, y, speedX, speedY) {
		this.x = x;
		this.y = y;
		this.speedX = speedX;
		this.speedY = speedY;
	};

	Ball.prototype.updatePosition = function () {
		function _update(ball, coord, speed, boundary) {
			ball[coord] += ball[speed];
			if (ball[coord] > boundary || ball[coord] < 0) {
				ball[speed] *= -1;
			}
		}

		_update(this, 'x', 'speedX', canvas.width);
		_update(this, 'y', 'speedY', canvas.height);
	};

	Ball.prototype.draw = function () {
		drawCircle(this.x, this.y, 10, 'white');
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


	ball = new Ball(100, 100, 5, 7);
	paddle = new Paddle((canvas.width - PADDLE_WIDTH) / 2, canvas.height - 100);

	function moveAll () {
		ball.updatePosition();
	}

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
	}

	function updateAll () {
		moveAll();
		drawAll();
	}
})();

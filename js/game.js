(function () {
	var canvas = document.getElementById('game-canvas'),
		canvasContext = canvas.getContext('2d'),
		fps = 30,
		ball;

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
	/* End Ball Class */


	ball = new Ball(100, 100, 5, 7);
	function updateAll () {
		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		canvasContext.fillStyle = 'white';
		canvasContext.beginPath();
		canvasContext.arc(ball.x, ball.y, 10, 0, Math.PI * 2, true);
		canvasContext.fill();
		ball.updatePosition();
	}
})();

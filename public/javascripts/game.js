(function () {
	var canvas = document.getElementById('game-canvas'),
		canvasContext = canvas.getContext('2d'),
		fps = 30,
		ball,
		paddle,
		bricks = [],
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY;

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
		// The ball touches the bottom screen
		if (this.y + BALL_RADIUS > canvas.height) {
			this.reset();
			resetBricks(bricks);
		}

		var brickIndex = Brick.colRowToIndex(
			Math.floor(ball.x / BRICK_SPACE_WIDTH),
			Math.floor(ball.y / BRICK_SPACE_HEIGHT)
		);
		if (0 <= brickIndex && brickIndex < BRICKS_NUMBER
			&& bricks[brickIndex].state == BRICK_STATE_ACTIVE
		) {
			bricks[brickIndex].state = BRICK_STATE_INACTIVE;
			this.speedY *= -1;
		}

		if (this.isCollidingWithRectangle(paddle)) {
			this.speedY *= -1;

			var centerPaddleX = paddle.x + PADDLE_WIDTH / 2,
				distFromPaddleCenter = ball.x - centerPaddleX;

			this.speedX = distFromPaddleCenter * 0.35;
		}
	};

	Ball.prototype.isCollidingWithRectangle = function (rectangle) {
		return this.y + BALL_RADIUS > rectangle.y &&
			this.y - BALL_RADIUS < rectangle.y + rectangle.h &&
			this.x  + BALL_RADIUS > rectangle.x &&
			this.x - BALL_RADIUS < rectangle.x + rectangle.w;
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
	var Paddle = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	Paddle.prototype.updatePosition = function (x) {
		this.x = x;
	};

	Paddle.prototype.draw = function () {
		drawRectangle(this.x, this.y, this.w, this.h, 'white');
	};
	/* End Paddle Class */

	/* Brick Class */
	var Brick = function (x, y, w, h, destructible, state) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.state = this.originalState = state;
		this.destructible = this.originalDestructible = destructible;
	}

	Brick.prototype.draw = function () {
		drawRectangle(this.x, this.y, this.w, this.h, 'red');
	};

	Brick.prototype.reset = function () {
		this.state = this.originalState;
		this.destructible = this.originalDestructible;
	};

	Brick.colRowToIndex = function (col, row) {
		return col + BRICK_GRID_COL * row;
	};
	/* End Brick Class */

	ball = new Ball(canvas.width / 2, canvas.height / 2, 5, 7);
	paddle = new Paddle(
		(canvas.width - PADDLE_WIDTH) / 2, canvas.height - 100,
		PADDLE_WIDTH,
		PADDLE_THICKNESS
	);

	var col, row;
	for (row = 0; row < BRICK_GRID_ROW; row++ ) {
		for (col = 0; col < BRICK_GRID_COL; col++ ) {
			bricks.push(new Brick(
				// 5 is the initial left margin
				BRICK_SPACE_WIDTH * col,
				BRICK_SPACE_HEIGHT * row,
				BRICK_WIDTH,
				BRICK_HEIGHT,
				true, BRICK_STATE_ACTIVE
			));
		}
	}

	// @TODO put that somewhere
	function resetBricks (bricks) {
		for (var b = 0; b < BRICKS_NUMBER; b++) {
			bricks[b].reset();
		}
	}

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

	function drawText (text, x, y, color) {
		canvasContext.fillStyle = color;
		canvasContext.fillText(text, x, y);
	}

	function drawAll () {
		drawRectangle(0, 0, canvas.width, canvas.height, 'black');
		ball.draw();
		paddle.draw();

		for (var b in bricks) {
			if (bricks[b].state == BRICK_STATE_ACTIVE) {
				bricks[b].draw();
			}
		}

		if (DEBUG) {
			drawText('(' +
				Math.floor(mouseX / BRICK_SPACE_WIDTH) + ', ' +
				Math.floor(mouseY / BRICK_SPACE_HEIGHT) + ', ' +
				Brick.colRowToIndex(Math.floor(mouseX / BRICK_SPACE_WIDTH), Math.floor(mouseY / BRICK_SPACE_HEIGHT)) + ')', mouseX, mouseY, 'white');
		}
	}

	function updateAll () {
		moveAll();
		drawAll();
	}
})();

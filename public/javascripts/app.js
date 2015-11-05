if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.executeModule('main',
'B', 'Canvas', 'Entities', 'Physics',
function (B, canvas, Entities, Physics) {
	var ball,
		paddle,
		bricks = [],
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY,
		fps = 30;

	canvas.init(document.getElementById('game-canvas'));

	setInterval(updateAll, 1000 / fps);

	ball = new Entities.Ball(canvas.width() / 2, canvas.height() / 2, 5, 7);
	paddle = new Entities.Paddle(
		(canvas.width() - PADDLE_WIDTH) / 2, canvas.height() - 100,
		PADDLE_WIDTH,
		PADDLE_THICKNESS
	);

	Physics.addObject('ball', ball);
	Physics.addObject('paddle', paddle);

	B.Events.on('lost', null, function () {
		resetBricks(bricks);
	});

	B.Events.on('mouse-moved', null, function (mX, mY) {
		mouseX = mX;
		mouseY = mY;
		if (mouseX > PADDLE_WIDTH / 2 && mouseX < canvas.width() - PADDLE_WIDTH / 2) {
			paddle.updatePosition(
				Math.min(
					Math.max(
						0,
						mouseX - PADDLE_WIDTH / 2
					),
					canvas.width() - PADDLE_WIDTH / 2
				)
			);
		}
	});

	var col, row;
	for (row = 0; row < BRICK_GRID_ROW; row++ ) {
		for (col = 0; col < BRICK_GRID_COL; col++ ) {
			bricks.push(new Entities.Brick(
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

	function moveAll () {
		ball.updatePosition();

		var brickIndex = Entities.Brick.colRowToIndex(
			Math.floor(ball.x / BRICK_SPACE_WIDTH),
			Math.floor(ball.y / BRICK_SPACE_HEIGHT)
		);
		if (0 <= brickIndex && brickIndex < BRICKS_NUMBER
			&& bricks[brickIndex].state == BRICK_STATE_ACTIVE
		) {
			bricks[brickIndex].state = BRICK_STATE_INACTIVE;
			ball.speedY *= -1;
		}

		if (Physics.sphereCollidesWithRect('ball', 'paddle')) {
			ball.speedY *= -1;

			var centerPaddleX = paddle.x + PADDLE_WIDTH / 2,
				distFromPaddleCenter = ball.x - centerPaddleX;

			ball.speedX = distFromPaddleCenter * 0.35;
		}
	}

	function drawAll () {
		canvas.drawRectangle(0, 0, canvas.width(), canvas.height(), 'black');
		ball.draw();
		paddle.draw();

		for (var b in bricks) {
			if (bricks[b].state == BRICK_STATE_ACTIVE) {
				bricks[b].draw();
			}
		}

		if (DEBUG) {
			canvas.drawText('(' +
				Math.floor(mouseX / BRICK_SPACE_WIDTH) + ', ' +
				Math.floor(mouseY / BRICK_SPACE_HEIGHT) + ', ' +
				Entities.Brick.colRowToIndex(Math.floor(mouseX / BRICK_SPACE_WIDTH), Math.floor(mouseY / BRICK_SPACE_HEIGHT)) + ')', mouseX, mouseY, 'white');
		}
	}

	function updateAll () {
		moveAll();
		drawAll();
	}
});

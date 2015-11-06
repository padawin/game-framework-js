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

	ball = new Entities.Ball(canvas.width() / 2, canvas.height() / 4, BALL_SPEED_X, BALL_SPEED_Y);
	paddle = new Entities.Paddle(
		(canvas.width() - PADDLE_WIDTH) / 2, canvas.height() - 100,
		PADDLE_WIDTH,
		PADDLE_THICKNESS
	);

	B.Events.on('win', null, function () {
		resetBricks(bricks);
		ball.reset();
	});

	B.Events.on('lost', null, function () {
		resetBricks(bricks);
	});

	B.Events.on('mouse-moved', null, function (mX, mY) {
		mouseX = mX;
		mouseY = mY;
		// @TODO move that in the paddle logic
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

		if (DEBUG) {
			ball.x = mouseX;
			ball.y = mouseY;
			ball.speedX = BALL_SPEED_X;
			ball.speedY = BALL_SPEED_Y * -1;
		}
	});

	var col, row;
	for (row = BRICK_GRID_START_ROW; row < BRICK_GRID_ROW; row++ ) {
		for (col = BRICK_GRID_START_COL; col < BRICK_GRID_COL; col++ ) {
			bricks.push(new Entities.Brick(
				// 5 is the initial left margin
				BRICK_SPACE_WIDTH * col,
				BRICK_SPACE_HEIGHT * row,
				BRICK_WIDTH,
				BRICK_HEIGHT,
				// @TODO remove destructable field
				true, BRICK_STATE_ACTIVE
			));
		}
	}

	var remainingBricks = BRICKS_NUMBER;

	// @TODO put that somewhere
	function resetBricks (bricks) {
		for (var b = 0; b < BRICKS_NUMBER; b++) {
			bricks[b].reset();
		}
	}

	colRowToGridIndex = function (col, row) {
		return col - BRICK_GRID_START_COL +
			(BRICK_GRID_COL - BRICK_GRID_START_COL) * (row - BRICK_GRID_START_ROW);
	};

	function moveAll () {
		ball.updatePosition();

		var brick,
			brickSide,
			brickTopBot;

		brick = bricks[colRowToGridIndex(
			ball.gridCellCol,
			ball.gridCellRow
		)];

		// if the ball is on an active brick
		if (BRICK_GRID_START_COL <= ball.gridCellCol && ball.gridCellCol < BRICK_GRID_COL
			&& BRICK_GRID_START_COL <= ball.gridCellRow && ball.gridCellRow < BRICK_GRID_ROW
			&& brick.state == BRICK_STATE_ACTIVE
		) {
			brick.state = BRICK_STATE_INACTIVE;
			remainingBricks--;

			if (remainingBricks == 0) {
				console.log('win');
				B.Events.fire('win');
				return;
			}

			// brick next to the current one, according to ball's old position
			brickSide = bricks[colRowToGridIndex(ball.oldGridCellCol, ball.gridCellRow)];
			// brick under or above to the current one, according to ball's old position
			brickTopBot = bricks[colRowToGridIndex(ball.gridCellCol, ball.oldGridCellRow)];
			Physics.sphereBounceAgainstGridRectangle(ball, brick, brickSide, brickTopBot);
		}

		// if the ball is colliding with the paddle
		if (Physics.sphereCollidesWithRectangle(ball, paddle)) {
			Physics.sphereBounceAgainstRectangle(ball, paddle);
		}
	}
	function updateAll () {
		moveAll();
		canvas.drawAll([ball, paddle, bricks]);

		if (DEBUG) {
			canvas.drawText('(' +
				Math.floor(mouseX / BRICK_SPACE_WIDTH) + ', ' +
				Math.floor(mouseY / BRICK_SPACE_HEIGHT) + ', ' +
				colRowToGridIndex(Math.floor(mouseX / BRICK_SPACE_WIDTH), Math.floor(mouseY / BRICK_SPACE_HEIGHT)) + ')', mouseX, mouseY, 'white');


			canvas.line([ball.x, ball.y], [ball.x + ball.speedX * 30, ball.y + ball.speedY * 30]);
		}
	}
});

if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Entry point of the game, contains some part of the game engine and deals with
 * the different entities
 */
loader.executeModule('main',
'B', 'Engine', 'Canvas', 'Entities', 'Physics', 'Utils', 'data', 'Controls', 'Level', 'GUI',
function (B, Engine, canvas, Entities, Physics, Utils, data, Controls, Level, GUI) {
	var ball,
		paddle,
		bricks = [],
		remainingBricks,
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY,
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || NO_DEBUG;

	Engine.addCallback('resetLevel', function () {
		// Set the number of remaining bricks to destroy
		remainingBricks = Engine.getLevel().counts[data.states.ACTIVE];
	});

	Engine.init(
		document.getElementById('game-canvas'),
		Engine.OPTION_USE_MOUSE,
		function () {
			// Init the ball
			var startCell = Engine.getLevel().getCoordinatesCenterCell(data.maps[0].start[0], data.maps[0].start[1]);
			ball = new Entities.Ball(startCell[0], startCell[1], BALL_RADIUS, BALL_SPEED_X, BALL_SPEED_Y);
			// Init the paddle at the middle of the game view, 100px above the bottom
			paddle = new Entities.Paddle(
				(canvas.width() - PADDLE_WIDTH) / 2, canvas.height() - 100,
				PADDLE_WIDTH,
				PADDLE_THICKNESS
			);
			Engine.addDrawable(ball);
			Engine.addDrawable(paddle);
		}
	);

	Engine.addCallback('win', function () {
		ball.reset();
	});

	Engine.addCallback('lose', function () {
		ball.reset();
	});

	Engine.addCallback('mouseMoved', function (mouseX, mouseY) {
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

	Engine.addCallback('gameFinishedScreen', function () {
		canvas.drawText('You won the game!', canvas.width() / 2 - 50, 200, 'white');
		canvas.drawText('Click to restart', canvas.width() / 2 - 45, 400, 'white');
	});

	Engine.addCallback('levelFinishedScreen', function () {
		canvas.drawText('Level finished', canvas.width() / 2 - 40, 200, 'white');
		canvas.drawText('Click to continue', canvas.width() / 2 - 45, 400, 'white');
	});

	/**
	 * Method to update the game state and the objects's position
	 */
	Engine.addCallback('moveAll', function () {
		// Update the ball position
		ball.updatePosition();

		/* Ball and edges collision*/
		var wallBounded = Physics.sphereBounceAgainstInnerRectangle(ball, {x: 0, y: 0, w: canvas.width(), h: canvas.height()});
		if (wallBounded == 'down') {
			ball.reset();
			console.log('fire lost');
			B.Events.fire('lost');
		}
		/* End of Ball and edges collision*/

		/* Ball and active brick collision */
		var brick,
			brickSide,
			brickTopBot,
			ballGridCellCol = Math.floor(ball.x / Engine.getLevel().gridCellWidth),
			ballGridCellRow = Math.floor(ball.y / Engine.getLevel().gridCellHeight)
			ballOldGridCellCol = Math.floor((ball.x - ball.speedX) / Engine.getLevel().gridCellWidth),
			ballOldGridCellRow = Math.floor((ball.y - ball.speedY) / Engine.getLevel().gridCellHeight);

		brick = Engine.getLevel().getCell(
			ballGridCellCol,
			ballGridCellRow
		);

		// if the ball is on an active brick
		if (0 <= ballGridCellCol && ballGridCellCol < Engine.getLevel().width
			&& 0 <= ballGridCellRow && ballGridCellRow < Engine.getLevel().height
			&& brick.state == data.states.ACTIVE
		) {
			// brick next to the current one, according to ball's old position
			brickSide = Engine.getLevel().getCell(ballOldGridCellCol, ballGridCellRow);
			brickSide = brickSide && brickSide.state == data.states.ACTIVE && brickSide || undefined;

			// brick under or above to the current one, according to ball's old position
			brickTopBot = Engine.getLevel().getCell(ballGridCellCol, ballOldGridCellRow);
			brickTopBot = brickTopBot && brickTopBot.state == data.states.ACTIVE && brickTopBot || undefined;

			Physics.sphereBounceAgainstGridRectangle(ball, brick, brickSide, brickTopBot);

			brick.state = data.states.INACTIVE;
			brick.texture = data.resources[brick.state].resource;
			remainingBricks--;

			if (remainingBricks == 0) {
				console.log('win');
				B.Events.fire('win');
				return;
			}
		}
		/* End of Ball and active brick collision */

		/* Ball and paddle collision */
		// if the ball is colliding with the paddle
		if (Physics.sphereCollidesWithRectangle(ball, paddle)) {
			Physics.sphereBounceAgainstRectangle(ball, paddle);
		}
		/* Ball and paddle collision */
	});
});

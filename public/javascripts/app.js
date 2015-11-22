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
		currentLevelIndex = 0,
		remainingBricks,
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY,
		fps = 30,
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || NO_DEBUG;

	B.on(window, 'load', function () {
		// Init the view
		canvas.init(document.getElementById('game-canvas'));
		Controls.init(false, document.getElementById('game-canvas'));

		Engine.addCallback('resetLevel', function () {
			// Set the number of remaining bricks to destroy
			remainingBricks = Engine.getLevel().counts[Entities.GridCell.STATE_ACTIVE];
		});

		Engine._loadResources(function () {
			Engine.resetLevel(true, currentLevelIndex);

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
			setInterval(Engine.updateAll, 1000 / fps);
		});
	});

	/* Events */
	// Event to execute when the player wins
	B.Events.on('win', null, function () {
		if (currentLevelIndex == data.maps.length - 1) {
			Engine.resetLevel(true, currentLevelIndex);
			Engine.gameFinished = true;
		}
		else {
			Engine.resetLevel(false, currentLevelIndex);
			Engine.levelFinished = true;
		}

		ball.reset();
	});

	// Event to execute when the player loses
	B.Events.on('lost', null, function () {
		Engine.resetLevel(false, currentLevelIndex);
		ball.reset();
	});

	// Event to execute when the mouse is clicked
	B.Events.on('mouse-clicked', null, function (mX, mY) {
		if (Engine.levelFinished) {
			currentLevelIndex++;
			Engine.resetLevel(true, currentLevelIndex);
			Engine.levelFinished = false;
		}
		else if (Engine.gameFinished) {
			currentLevelIndex = 0;
			Engine.resetLevel(true, currentLevelIndex);
			Engine.gameFinished = false;
		}
	});

	// Event to execute when the mouse move
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
	/* End of Events */

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
			&& brick.state == Entities.GridCell.STATE_ACTIVE
		) {
			// brick next to the current one, according to ball's old position
			brickSide = Engine.getLevel().getCell(ballOldGridCellCol, ballGridCellRow);
			brickSide = brickSide && brickSide.state == Entities.GridCell.STATE_ACTIVE && brickSide || undefined;

			// brick under or above to the current one, according to ball's old position
			brickTopBot = Engine.getLevel().getCell(ballGridCellCol, ballOldGridCellRow);
			brickTopBot = brickTopBot && brickTopBot.state == Entities.GridCell.STATE_ACTIVE && brickTopBot || undefined;

			Physics.sphereBounceAgainstGridRectangle(ball, brick, brickSide, brickTopBot);

			brick.state = Entities.GridCell.STATE_INACTIVE;
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

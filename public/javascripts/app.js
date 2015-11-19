if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Entry point of the game, contains some part of the game engine and deals with
 * the different entities
 */
loader.executeModule('main',
'B', 'Canvas', 'Entities', 'Physics', 'Utils', 'data', 'Controls', 'Level', 'GUI',
function (B, canvas, Entities, Physics, Utils, data, Controls, Level, GUI) {
	var ball,
		level,
		paddle,
		bricks = [],
		remainingBricks,
		currentLevelIndex = 0,
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY,
		fps = 30,
		urlParams = Utils.getUrlParams(window.location.search),
		// some states
		gameFinished = false,
		levelFinished = false;

	const DEBUG = urlParams.debug || NO_DEBUG;

	B.on(window, 'load', function () {
		// Init the view
		canvas.init(document.getElementById('game-canvas'));
		Controls.init(false, document.getElementById('game-canvas'));

		loadResources(function () {
			setInterval(updateAll, 1000 / fps);
			resetLevel(true);

			// Init the ball
			var startCell = level.getCoordinatesCenterCell(data.maps[0].start[0], data.maps[0].start[1]);
			ball = new Entities.Ball(startCell[0], startCell[1], BALL_RADIUS, BALL_SPEED_X, BALL_SPEED_Y);
			// Init the paddle at the middle of the game view, 100px above the bottom
			paddle = new Entities.Paddle(
				(canvas.width() - PADDLE_WIDTH) / 2, canvas.height() - 100,
				PADDLE_WIDTH,
				PADDLE_THICKNESS
			);
		});
	});

	/* Events */
	// Event to execute when the player wins
	B.Events.on('win', null, function () {
		currentLevelIndex++;
		if (currentLevelIndex == data.maps.length) {
			resetLevel(true);
			gameFinished = true;
		}
		else {
			resetLevel(false);
			levelFinished = true;
		}

		ball.reset();
	});

	// Event to execute when the player loses
	B.Events.on('lost', null, function () {
		resetLevel(false);
		ball.reset();
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

	function displayWinGameScreen () {
		canvas.drawText('You won the game!', canvas.width() / 2 - 50, 200, 'white');
		canvas.drawText('Click to restart', canvas.width() / 2 - 45, 400, 'white');
	}

	function displayWinLevelScreen () {
		canvas.drawText('Level finished', canvas.width() / 2 - 40, 200, 'white');
		canvas.drawText('Click to continue', canvas.width() / 2 - 45, 400, 'white');
	}

	function loadResources (loadedCallback) {
		var r, loaded = 0,
			loadingPadding = canvas.width() / 5,
			loadingWidth = 3 * loadingPadding;

		if (!data.resources) {
			loadedCallback();
			return;
		}

		canvas.clearScreen();
		GUI.progressBar(
			loadingPadding, canvas.height() / 2,
			loadingWidth, 30,
			0,
			'black', 'white', 'black'
		);
		for (r = 0; r < data.resources.length; r++) {
			data.resources[r].resource = new Image();
			data.resources[r].resource.onload = function () {
				if (++loaded == data.resources.length) {
					loadedCallback();
				}
				else {
					GUI.progressBar(
						loadingPadding, canvas.height() / 2,
						loadingWidth, 30,
						loaded / data.resources.length,
						'black', 'white', 'black'
					);
				}
			};
			data.resources[r].resource.src = data.resources[r].url;
		}
	}

	function resetLevel (newLevel) {
		if (newLevel) {
			level = Level.createLevel(data, currentLevelIndex);
		}
		else {
			level.reset();
		}

		// Set the number of remaining bricks to destroy
		remainingBricks = level.counts[Entities.GridCell.STATE_ACTIVE];
	}

	/**
	 * Method to update the game state and the objects's position
	 */
	function moveAll () {
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
			ballGridCellCol = Math.floor(ball.x / level.gridCellWidth),
			ballGridCellRow = Math.floor(ball.y / level.gridCellHeight)
			ballOldGridCellCol = Math.floor((ball.x - ball.speedX) / level.gridCellWidth),
			ballOldGridCellRow = Math.floor((ball.y - ball.speedY) / level.gridCellHeight);

		brick = level.getCell(
			ballGridCellCol,
			ballGridCellRow
		);

		// if the ball is on an active brick
		if (0 <= ballGridCellCol && ballGridCellCol < level.width
			&& 0 <= ballGridCellRow && ballGridCellRow < level.height
			&& brick.state == Entities.GridCell.STATE_ACTIVE
		) {
			// brick next to the current one, according to ball's old position
			brickSide = level.getCell(ballOldGridCellCol, ballGridCellRow);
			brickSide = brickSide && brickSide.state == Entities.GridCell.STATE_ACTIVE && brickSide || undefined;

			// brick under or above to the current one, according to ball's old position
			brickTopBot = level.getCell(ballGridCellCol, ballOldGridCellRow);
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
	}

	/**
	 * Method to execute on each frame to update the game state and the
	 * objects's position and then redraw the canvas
	 */
	function updateAll () {
		moveAll();
		canvas.clearScreen('black');
		canvas.drawAll([ball, paddle, level.cells]);
	}
});

if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Entry point of the game, contains some part of the game engine and deals with
 * the different entities
 */
loader.executeModule('main',
'B', 'Canvas', 'Entities', 'Physics', 'Utils', 'Maps',
function (B, canvas, Entities, Physics, Utils, Maps) {
	var ball,
		tracks = [],
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY,
		fps = 30,
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || NO_DEBUG;
	console.log(DEBUG);

	// Init the view
	canvas.init(document.getElementById('game-canvas'));
	setInterval(updateAll, 1000 / fps);

	/* Events */
	// Event to execute when the player wins
	B.Events.on('win', null, function () {
		ball.reset();
	});

	// Event to execute when the player loses
	B.Events.on('lost', null, function () {
	});

	// Event to execute when the mouse move
	B.Events.on('mouse-moved', null, function (mX, mY) {
		mouseX = mX;
		mouseY = mY;

		if (DEBUG) {
			ball.x = mouseX;
			ball.y = mouseY;
			ball.speedX = BALL_SPEED_X;
			ball.speedY = BALL_SPEED_Y * -1;
		}
	});
	/* End of Events */

	/*
	 * Create the tracks, The whole game is a grid and tracks are on the grid
	 * The tracks are organised on a rectangle of the grid started at the
	 * position (TRACK_GRID_START_COL, TRACK_GRID_START_COL) and ends at the
	 * position (TRACK_GRID_COL, TRACK_GRID_ROW)
	 * Each track is an instance of the class Entities.Track
	 */
	var col, row,
		trackWidth = canvas.width() / Maps[0].width,
		trackHeight = canvas.height() / Maps[0].height,
		startX, startY;
	for (row = 0; row < Maps[0].height; row++ ) {
		for (col = 0; col < Maps[0].width; col++ ) {
			tracks.push(new Entities.Track(
				// 5 is the initial left margin
				trackWidth * col, trackHeight * row,
				trackWidth, trackHeight,
				// @TODO remove destructable field
				true, Maps[0].map[row][col]
			));

			if (Maps[0].map[row][col] == TRACK_STATE_START) {
				startX = trackWidth * col + trackWidth / 2;
				startY = trackHeight * row + trackHeight / 2;
			}
		}
	}

	// Init the ball
	ball = new Entities.Ball(startX, startY, BALL_RADIUS, BALL_SPEED_X, BALL_SPEED_Y);
	// Position of the ball in the grid
	ball.setGridCoordinates(TRACK_SPACE_WIDTH, TRACK_SPACE_HEIGHT);

	/**
	 * Method to convert a pair of coordinates to the index of the cell in the
	 * grid the coordinates are in
	 */
	colRowToGridIndex = function (col, row) {
		return col - TRACK_GRID_START_COL +
			(TRACK_GRID_COL - TRACK_GRID_START_COL) * (row - TRACK_GRID_START_ROW);
	};

	/**
	 * Method to update the game state and the objects's position
	 */
	function moveAll () {
		// Update the ball position
		ball.updatePosition();
		ball.setGridCoordinates(TRACK_SPACE_WIDTH, TRACK_SPACE_HEIGHT);

		/* Ball and edges collision*/
		var wallBounded = Physics.sphereBounceAgainstInnerRectangle(ball, {x: 0, y: 0, w: canvas.width(), h: canvas.height()});
		if (wallBounded == 'down') {
			ball.reset();
			console.log('fire lost');
			B.Events.fire('lost');
		}
		/* End of Ball and edges collision*/

		/* Ball and active track collision */
		var track,
			trackSide,
			trackTopBot;

		track = tracks[colRowToGridIndex(
			ball.gridCellCol,
			ball.gridCellRow
		)];

		// if the ball is on an active track
		if (TRACK_GRID_START_COL <= ball.gridCellCol && ball.gridCellCol < TRACK_GRID_COL
			&& TRACK_GRID_START_COL <= ball.gridCellRow && ball.gridCellRow < TRACK_GRID_ROW
			&& track.state == Entities.Track.STATE_ACTIVE
		) {
			// track next to the current one, according to ball's old position
			trackSide = tracks[colRowToGridIndex(ball.oldGridCellCol, ball.gridCellRow)];
			trackSide = trackSide && trackSide.state == Entities.Track.STATE_ACTIVE && trackSide || undefined;

			// track under or above to the current one, according to ball's old position
			trackTopBot = tracks[colRowToGridIndex(ball.gridCellCol, ball.oldGridCellRow)];
			trackTopBot = trackTopBot && trackTopBot.state == Entities.Track.STATE_ACTIVE && trackTopBot || undefined;

			Physics.sphereBounceAgainstGridRectangle(ball, track, trackSide, trackTopBot);
		}
		/* End of Ball and active track collision */
	}

	/**
	 * Method to execute on each frame to update the game state and the
	 * objects's position and then redraw the canvas
	 */
	function updateAll () {
		moveAll();
		canvas.drawAll([ball, tracks]);

		if (DEBUG) {
			canvas.drawText('(' +
				Math.floor(mouseX / TRACK_SPACE_WIDTH) + ', ' +
				Math.floor(mouseY / TRACK_SPACE_HEIGHT) + ', ' +
				colRowToGridIndex(Math.floor(mouseX / TRACK_SPACE_WIDTH), Math.floor(mouseY / TRACK_SPACE_HEIGHT)) + ')', mouseX, mouseY, 'white');


			canvas.line([ball.x, ball.y], [ball.x + ball.speedX * 30, ball.y + ball.speedY * 30]);
		}
	}
});

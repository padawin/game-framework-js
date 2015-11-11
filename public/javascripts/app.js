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
	var car,
		tracks = [],
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY,
		fps = 30,
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || NO_DEBUG;
	console.log(DEBUG);


	B.on(window, 'load', function () {
		// Init the view
		canvas.init(document.getElementById('game-canvas'));

		setInterval(updateAll, 1000 / fps);

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

				if (Maps[0].map[row][col] == Entities.Track.STATE_START) {
					startX = trackWidth * col + trackWidth / 2;
					startY = trackHeight * row + trackHeight / 2;
				}
			}
		}

		// Init the car
		car = new Entities.Car(startX, startY, CAR_RADIUS, 0, CAR_SPEED);
		// Position of the car in the grid
		car.setGridCoordinates(TRACK_SPACE_WIDTH, TRACK_SPACE_HEIGHT);

		car.setGraphic(B.create('img'));
		car.graphic.onload = function () {
			car.setGraphicLoaded(true);
		};
		car.graphic.src = '/images/player1car.png';
	});

	/* Events */
	// Event to execute when the player wins
	B.Events.on('win', null, function () {
		car.reset();
	});

	// Event to execute when the player loses
	B.Events.on('lost', null, function () {
	});

	// Event to execute when the mouse move
	B.Events.on('mouse-moved', null, function (mX, mY) {
		mouseX = mX;
		mouseY = mY;

		if (DEBUG) {
			car.x = mouseX;
			car.y = mouseY;
			car.speed = CAR_SPEED;
		}
	});
	/* End of Events */

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
		// Update the car position
		car.updatePosition();
		car.setGridCoordinates(TRACK_SPACE_WIDTH, TRACK_SPACE_HEIGHT);

		/* Car and edges collision*/
		var wallBounded = Physics.sphereBounceAgainstInnerRectangle(car, {x: 0, y: 0, w: canvas.width(), h: canvas.height()});
		if (wallBounded == 'down') {
			car.reset();
			console.log('fire lost');
			B.Events.fire('lost');
		}
		/* End of Car and edges collision*/

		/* Car and active track collision */
		var track,
			trackSide,
			trackTopBot;

		track = tracks[colRowToGridIndex(
			car.gridCellCol,
			car.gridCellRow
		)];

		// if the car is on an active track
		if (TRACK_GRID_START_COL <= car.gridCellCol && car.gridCellCol < TRACK_GRID_COL
			&& TRACK_GRID_START_COL <= car.gridCellRow && car.gridCellRow < TRACK_GRID_ROW
			&& track.state == Entities.Track.STATE_ACTIVE
		) {
			// track next to the current one, according to car's old position
			trackSide = tracks[colRowToGridIndex(car.oldGridCellCol, car.gridCellRow)];
			trackSide = trackSide && trackSide.state == Entities.Track.STATE_ACTIVE && trackSide || undefined;

			// track under or above to the current one, according to car's old position
			trackTopBot = tracks[colRowToGridIndex(car.gridCellCol, car.oldGridCellRow)];
			trackTopBot = trackTopBot && trackTopBot.state == Entities.Track.STATE_ACTIVE && trackTopBot || undefined;

			Physics.sphereBounceAgainstGridRectangle(car, track, trackSide, trackTopBot);
		}
		/* End of Car and active track collision */
	}

	/**
	 * Method to execute on each frame to update the game state and the
	 * objects's position and then redraw the canvas
	 */
	function updateAll () {
		moveAll();
		canvas.drawAll([car, tracks]);

		if (DEBUG) {
			canvas.drawText('(' +
				Math.floor(mouseX / TRACK_SPACE_WIDTH) + ', ' +
				Math.floor(mouseY / TRACK_SPACE_HEIGHT) + ', ' +
				colRowToGridIndex(Math.floor(mouseX / TRACK_SPACE_WIDTH), Math.floor(mouseY / TRACK_SPACE_HEIGHT)) + ')', mouseX, mouseY, 'white');


			// @TODO adapt with angle
			// canvas.line([car.x, car.y], [car.x + car.speedX * 30, car.y + car.speedY * 30]);
		}
	}
});

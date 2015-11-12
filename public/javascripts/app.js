if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Entry point of the game, contains some part of the game engine and deals with
 * the different entities
 */
loader.executeModule('main',
'B', 'Canvas', 'Entities', 'Physics', 'Utils', 'Maps', 'Controls',
function (B, canvas, Entities, Physics, Utils, Maps, Controls) {
	var car,
		walls = [],
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
		Controls.init();

		setInterval(updateAll, 1000 / fps);

		/*
		 * Create the walls, The whole game is a grid and walls are on the grid
		 * The walls are organised on a rectangle of the grid started at the
		 * position (GRID_CELL_GRID_START_COL, GRID_CELL_GRID_START_COL) and ends at the
		 * position (GRID_CELL_GRID_COL, GRID_CELL_GRID_ROW)
		 * Each wall is an instance of the class Entities.GridCell
		 */
		var col, row,
			gridCellWidth = canvas.width() / Maps[0].width,
			gridCellHeight = canvas.height() / Maps[0].height,
			startX, startY;
		for (row = 0; row < Maps[0].height; row++ ) {
			for (col = 0; col < Maps[0].width; col++ ) {
				walls.push(new Entities.GridCell(
					// 5 is the initial left margin
					gridCellWidth * col, gridCellHeight * row,
					gridCellWidth, gridCellHeight,
					// @TODO remove destructable field
					true, Maps[0].map[row][col]
				));

				if (Maps[0].map[row][col] == Entities.GridCell.STATE_START) {
					startX = gridCellWidth * col + gridCellWidth / 2;
					startY = gridCellHeight * row + gridCellHeight / 2;
				}
			}
		}

		// Init the car
		car = new Entities.Car(startX, startY, CAR_RADIUS, Math.PI / 2, CAR_SPEED);
		// Position of the car in the grid
		car.setGridCoordinates(GRID_CELL_SPACE_WIDTH, GRID_CELL_SPACE_HEIGHT);

		car.setGraphic(B.create('img'));
		car.graphic.onload = function () {
			car.setGraphicLoaded(true);
		};
		car.graphic.src = '/images/player1car.png';

		B.Events.on('keydown', car, function (code) {
			if (code == KEY_LEFT_ARROW) {
				car.steerLeft(true);
			}
			else if (code == KEY_UP_ARROW) {
				car.accelerate(true);
			}
			else if (code == KEY_RIGHT_ARROW) {
				car.steerRight(true);
			}
			else if (code == KEY_DOWN_ARROW) {
				car.reverse(true);
			}
		});

		B.Events.on('keyup', car, function (code) {
			if (code == KEY_LEFT_ARROW) {
				car.steerLeft(false);
			}
			else if (code == KEY_UP_ARROW) {
				car.accelerate(false);
			}
			else if (code == KEY_RIGHT_ARROW) {
				car.steerRight(false);
			}
			else if (code == KEY_DOWN_ARROW) {
				car.reverse(false);
			}
		});
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
		return col - GRID_CELL_GRID_START_COL +
			(GRID_CELL_GRID_COL - GRID_CELL_GRID_START_COL) * (row - GRID_CELL_GRID_START_ROW);
	};

	/**
	 * Method to update the game state and the objects's position
	 */
	function moveAll () {
		// Update the car position
		car.updatePosition();
		car.setGridCoordinates(GRID_CELL_SPACE_WIDTH, GRID_CELL_SPACE_HEIGHT);

		/* Car and edges collision*/
		Physics.sphereBounceAgainstInnerRectangle(car, {x: 0, y: 0, w: canvas.width(), h: canvas.height()});
		/* End of Car and edges collision*/

		/* Car and wall collision */
		var wall = walls[colRowToGridIndex(
			car.gridCellCol,
			car.gridCellRow
		)];

		// if the car is on a wall
		if (GRID_CELL_GRID_START_COL <= car.gridCellCol && car.gridCellCol < GRID_CELL_GRID_COL
			&& GRID_CELL_GRID_START_COL <= car.gridCellRow && car.gridCellRow < GRID_CELL_GRID_ROW
			&& wall.state == Entities.GridCell.STATE_ACTIVE
		) {
			car.bumpBack();
		}
		/* End of Car and wall collision */
	}

	/**
	 * Method to execute on each frame to update the game state and the
	 * objects's position and then redraw the canvas
	 */
	function updateAll () {
		moveAll();
		canvas.drawAll([walls, car]);

		if (DEBUG) {
			canvas.drawText('(' +
				Math.floor(mouseX / GRID_CELL_SPACE_WIDTH) + ', ' +
				Math.floor(mouseY / GRID_CELL_SPACE_HEIGHT) + ', ' +
				colRowToGridIndex(Math.floor(mouseX / GRID_CELL_SPACE_WIDTH), Math.floor(mouseY / GRID_CELL_SPACE_HEIGHT)) + ')', mouseX, mouseY, 'white');


			// @TODO adapt with angle
			// canvas.line([car.x, car.y], [car.x + car.speedX * 30, car.y + car.speedY * 30]);
		}
	}
});

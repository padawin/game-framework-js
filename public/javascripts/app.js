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
	var level,
		walls = [],
		// position of the mouse in the canvas, taking in account the scroll
		// and position of the canvas in the page
		mouseX,
		mouseY,
		nbPlayers = 2,
		players = [],
		playerControls = [
			{gasKey: KEY_UP_ARROW, reverseKey: KEY_DOWN_ARROW, leftKey: KEY_LEFT_ARROW, rightKey: KEY_RIGHT_ARROW},
			{gasKey: KEY_W, reverseKey: KEY_S, leftKey: KEY_A, rightKey: KEY_D}
		];
		fps = 30,
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || NO_DEBUG;

	B.on(window, 'load', function () {
		// Init the view
		canvas.init(document.getElementById('game-canvas'));
		Controls.init(true);

		loadResources(function () {
			setInterval(updateAll, 1000 / fps);

			level = Level.createLevel(data, 0);

			// Init the car

			for (var p = 0; p < data.maps[0].start.length && p < nbPlayers; p++) {
				var startCell = level.getCoordinatesCenterCell(data.maps[0].start[p][0], data.maps[0].start[p][1]),
					car = new Entities.Car('MyCar', startCell[0], startCell[1], Math.PI / 2, CAR_SPEED);
				car.setGraphic(data.resources[data.resourcesMap.CAR].resource);
				players.push(car);
			}
		});

		function key (code, pressed, car, controls) {
			if (code == controls.leftKey) {
				car.steerLeft(pressed);
			}
			else if (code == controls.gasKey) {
				car.accelerate(pressed);
			}
			else if (code == controls.rightKey) {
				car.steerRight(pressed);
			}
			else if (code == controls.reverseKey) {
				car.reverse(pressed);
			}
		}

		B.Events.on('keydown', null, function (code) {
			for (var p = 0; p < nbPlayers; p++) {
				key(code, true, players[p], playerControls[p]);
			}
		});

		B.Events.on('keyup', null, function (code) {
			for (var p = 0; p < nbPlayers; p++) {
				key(code, false, players[p], playerControls[p]);
			}
		});
	});

	/* Events */
	// Event to execute when the player wins
	B.Events.on('win', null, function (winner) {
		console.log('And the winner is: ' + winner.name);
		for (var p = 0; p < nbPlayers; p++) {
			players[p].reset();
		}
	});

	// Event to execute when the player loses
	B.Events.on('lost', null, function () {
	});

	// Event to execute when the mouse move
	B.Events.on('mouse-moved', null, function (mX, mY) {
		mouseX = mX;
		mouseY = mY;
	});
	/* End of Events */

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

	/**
	 * Method to update the game state and the objects's position
	 */
	function moveAll () {
		for (var p = 0; p < nbPlayers; p++) {
			// Update the cars position
			players[p].updatePosition();

			var carGridCellCol = Math.floor(players[p].x / level.gridCellWidth),
				carGridCellRow = Math.floor(players[p].y / level.gridCellHeight);

			/* Car and wall collision */
			var wall = level.getCell(
				carGridCellCol,
				carGridCellRow
			);

			// if the car is on a wall
			if (0 <= carGridCellCol && carGridCellCol < level.width
				&& 0 <= carGridCellRow && carGridCellRow < level.height
			) {
				if (data.resources[wall.state].obstacle) {
					players[p].bumpBack();
				}
				else if (wall.state == data.resourcesMap.TILE_FINISH) {
					B.Events.fire('win', [players[p]]);
				}
			}
			else {
				players[p].bumpBack();
			}
			/* End of Car and wall collision */
		}
	}

	/**
	 * Method to execute on each frame to update the game state and the
	 * objects's position and then redraw the canvas
	 */
	function updateAll () {
		moveAll();
		canvas.drawAll([level.cells, players]);
	}
});

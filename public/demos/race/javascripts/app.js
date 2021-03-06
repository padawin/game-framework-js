"use strict";

if (typeof (require) != 'undefined') {
	var loader = require('../../../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Entry point of the game, contains some part of the game engine and deals with
 * the different entities
 */
loader.executeModule('main',
'B', 'Engine', 'Canvas', 'Entities', 'GameEntities', 'Utils', 'data', 'Controls', 'Level',
function (B, Engine, canvas, Entities, GameEntities, Utils, data, Controls, Level) {
	var level,
		walls = [],
		nbPlayers = 2,
		players = [],
		playerControls = [
			{gasKey: Controls.KEY_UP_ARROW, reverseKey: Controls.KEY_DOWN_ARROW, leftKey: Controls.KEY_LEFT_ARROW, rightKey: Controls.KEY_RIGHT_ARROW},
			{gasKey: Controls.KEY_W, reverseKey: Controls.KEY_S, leftKey: Controls.KEY_A, rightKey: Controls.KEY_D}
		],
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || Engine.NO_DEBUG;

	Engine.init(
		document.getElementById('game-canvas'),
		Engine.OPTION_USE_KEYBOARD | Engine.OPTION_USE_MOUSE,
		function () {
			// Init the car
			for (var p = 0; p < data.maps[0].start.length && p < nbPlayers; p++) {
				var startCell = Engine.getLevel().getCoordinatesCenterCell(data.maps[0].start[p][0], data.maps[0].start[p][1]),
					car = new GameEntities.Car('MyCar', startCell[0], startCell[1], Math.PI / 2);
				car.setGraphic(data.resources[data.resourcesMap.CAR[p]].resource);
				players.push(car);
			}

			Engine.addDrawable(players);
		}
	);

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

	Engine.addCallback('win', function (winner) {
		console.log('And the winner is: ' + winner.name);
		for (var p = 0; p < nbPlayers; p++) {
			players[p].reset();
		}
	});

	/**
	 * Method to update the game state and the objects's position
	 */
	Engine.addCallback('moveAll', function () {
		for (var p = 0; p < nbPlayers; p++) {
			// Update the cars position
			players[p].updatePosition();

			var carGridCell = Engine.getLevel().getGridCellcoodinatesAt(players[p].x, players[p].y);

			/* Car and wall collision */
			var tileUnderCar = Engine.getLevel().getCell(
				carGridCell[0],
				carGridCell[1]
			);

			// if the car is on a wall
			if (0 <= carGridCell[0] && carGridCell[0] < Engine.getLevel().width
				&& 0 <= carGridCell[1] && carGridCell[1] < Engine.getLevel().height
			) {
				if (data.resources[tileUnderCar.state].obstacle) {
					players[p].bumpBack();
				}
				else if (tileUnderCar.state == data.resourcesMap.TILE_FINISH) {
					B.Events.fire('win', [players[p]]);
				}
			}
			else {
				players[p].bumpBack();
			}
			/* End of Car and wall collision */
		}
	});
});

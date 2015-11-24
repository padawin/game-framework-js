if (typeof (require) != 'undefined') {
	var loader = require('../../../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Entry point of the game, contains some part of the game engine and deals with
 * the different entities
 */
loader.executeModule('main',
'B', 'Engine', 'Canvas', 'Entities', 'GameEntities', 'Physics', 'Utils', 'data', 'Controls', 'Level', 'GUI',
function (B, Engine, canvas, Entities, GameEntities, Physics, Utils, data, Controls, Level, GUI) {
	var level,
		walls = [],
		nbPlayers = 2,
		car,
		playerControls = {gasKey: Controls.KEY_UP_ARROW, reverseKey: Controls.KEY_DOWN_ARROW, leftKey: Controls.KEY_LEFT_ARROW, rightKey: Controls.KEY_RIGHT_ARROW};
		fps = 30,
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || NO_DEBUG;

	Engine.init(
		document.getElementById('game-canvas'),
		Engine.OPTION_USE_KEYBOARD,
		function () {
			var startCell = Engine.getLevel().getCoordinatesCenterCell(data.maps[0].start[0], data.maps[0].start[1])
			car = new GameEntities.Car('MyCar', startCell[0], startCell[1], Math.PI / 2);
			car.setGraphic(data.resources[data.resourcesMap.CAR].resource);

			Engine.addDrawable(car);
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
		key(code, true, car, playerControls);
	});

	B.Events.on('keyup', null, function (code) {
		key(code, false, car, playerControls);
	});

	Engine.addCallback('win', function (winner) {
		car.reset();
	});

	/**
	 * Method to update the game state and the objects's position
	 */
	Engine.addCallback('moveAll', function () {
		// Update the cars position
		car.updatePosition();

		var carGridCellCol = Math.floor(car.x / Engine.getLevel().gridCellWidth),
			carGridCellRow = Math.floor(car.y / Engine.getLevel().gridCellHeight);

		/* Car and wall collision */
		var tileUnderCar = Engine.getLevel().getCell(
			carGridCellCol,
			carGridCellRow
		);

		// if the car is on a wall
		if (0 <= carGridCellCol && carGridCellCol < Engine.getLevel().width
			&& 0 <= carGridCellRow && carGridCellRow < Engine.getLevel().height
		) {
			if (data.resources[tileUnderCar.state].obstacle) {
				car.bumpBack();
			}
			else if (tileUnderCar.state == data.resourcesMap.TILE_FINISH) {
				B.Events.fire('win', [car]);
			}
		}
		else {
			car.bumpBack();
		}
		/* End of Car and wall collision */
	});
});

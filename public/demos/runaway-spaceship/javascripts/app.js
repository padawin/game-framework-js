"use strict"

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
		ship,
		playerControls = {left: Controls.KEY_LEFT_ARROW, right: Controls.KEY_RIGHT_ARROW};


	Engine.init(
		document.getElementById('game-canvas'),
		Engine.OPTION_USE_KEYBOARD | Engine.OPTION_USE_MOUSE | Engine.OPTION_FIXED_SIZE_WORLD,
		function () {
			var startCell = Engine.getLevel().getCoordinatesCenterCell(data.maps[0].start[0], data.maps[0].start[1]);
			ship = new GameEntities.Ship(startCell[0], startCell[1], Math.PI / 2);
			ship.setGraphic(data.resources[data.resourcesMap.SHIP]);

			Engine.addDrawable(ship);
			Engine.initCamera(startCell[0], startCell[1], 0, 0, canvas.width(), canvas.height());
		}
	);

	function key (code, pressed, ship, controls) {
		if (code == controls.left) {
			ship.steerLeft(pressed);
		}
		else if (code == controls.right) {
			ship.steerRight(pressed);
		}
	}

	B.Events.on('keydown', null, function (code) {
		key(code, true, ship, playerControls);
	});

	B.Events.on('keyup', null, function (code) {
		key(code, false, ship, playerControls);
	});

	Engine.addCallback('win', function (winner) {
		ship.reset();
	});

	Engine.addCallback('lose', function (winner) {
		ship.reset();
	});

	/**
	 * Method to update the game state and the objects's position
	 */
	Engine.addCallback('moveAll', function () {
		// Update the ships position
		ship.updatePosition();

		var shipGridCell = Engine.getLevel().getGridCellcoodinatesAt(ship.x, ship.y),
			/* Ship and wall collision */
			tileUnderShip = Engine.getLevel().getCell(
				shipGridCell[0],
				shipGridCell[1]
			);

		// if the ship is on a wall
		if (0 <= shipGridCell[0] && shipGridCell[0] < Engine.getLevel().width
			&& 0 <= shipGridCell[1] && shipGridCell[1] < Engine.getLevel().height
		) {
			if (tileUnderShip.state == data.resourcesMap.GOAL) {
				B.Events.fire('win');
			}
			else if (tileUnderShip.state == data.resourcesMap.MINE) {
				B.Events.fire('lost');
			}
		}
		else {
			B.Events.fire('lost');
		}

		Engine.updateCameraPosition(ship.x, ship.y);
		/* End of Ship and wall collision */
	});
});

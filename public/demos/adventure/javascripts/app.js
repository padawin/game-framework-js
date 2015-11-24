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
		warrior,
		playerControls = {up: Controls.KEY_UP_ARROW, down: Controls.KEY_DOWN_ARROW, left: Controls.KEY_LEFT_ARROW, right: Controls.KEY_RIGHT_ARROW};
		fps = 30,
		urlParams = Utils.getUrlParams(window.location.search);

	const DEBUG = urlParams.debug || NO_DEBUG;

	Engine.init(
		document.getElementById('game-canvas'),
		Engine.OPTION_USE_KEYBOARD,
		function () {
			var startCell = Engine.getLevel().getCoordinatesCenterCell(data.maps[0].start[0], data.maps[0].start[1])
			warrior = new GameEntities.Warrior('MyWarrior', startCell[0], startCell[1]);
			warrior.setGraphic(data.resources[data.resourcesMap.WARRIOR].resource);

			Engine.addDrawable(warrior);
		}
	);

	function key (code, pressed, warrior, controls) {
		if (code == controls.left) {
			warrior.walkLeft(pressed);
		}
		else if (code == controls.up) {
			warrior.walkUp(pressed);
		}
		else if (code == controls.right) {
			warrior.walkRight(pressed);
		}
		else if (code == controls.down) {
			warrior.walkDown(pressed);
		}
	}

	B.Events.on('keydown', null, function (code) {
		key(code, true, warrior, playerControls);
	});

	B.Events.on('keyup', null, function (code) {
		key(code, false, warrior, playerControls);
	});

	Engine.addCallback('win', function (winner) {
		warrior.reset();
	});

	/**
	 * Method to update the game state and the objects's position
	 */
	Engine.addCallback('moveAll', function () {
		// Update the warriors position
		warrior.updatePosition();

		var warriorGridCellCol = Math.floor(warrior.x / Engine.getLevel().gridCellWidth),
			warriorGridCellRow = Math.floor(warrior.y / Engine.getLevel().gridCellHeight);

		/* Warrior and wall collision */
		var tileUnderWarrior = Engine.getLevel().getCell(
			warriorGridCellCol,
			warriorGridCellRow
		);

		// if the warrior is on a wall
		if (0 <= warriorGridCellCol && warriorGridCellCol < Engine.getLevel().width
			&& 0 <= warriorGridCellRow && warriorGridCellRow < Engine.getLevel().height
		) {
			if (data.resources[tileUnderWarrior.state].obstacle) {
				warrior.bumpBack();
			}
			else if (tileUnderWarrior.state == data.resourcesMap.TILE_FINISH) {
				B.Events.fire('win', [warrior]);
			}
		}
		else {
			warrior.bumpBack();
		}
		/* End of Warrior and wall collision */
	});
});

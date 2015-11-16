if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with physics calculations and collisions
 */
loader.addModule('Level',
'Canvas', 'Entities',
function (canvas, Entities) {
	var level, LevelClass;

	LevelClass = function () {

	};

	LevelClass.prototype.getCell = function (col, row) {
		return this.cells[col + this.width * row];
	};

	LevelClass.prototype.changeCellState = function (cellIndex, newState) {
		level.counts[this.cells[cellIndex].state]--;
		this.cells[cellIndex].state = newState;

		_incrementStateCount(level, state);
	};

	function _incrementStateCount (level, state) {
		if (!level.counts[state]) {
			level.counts[state] = 1;
		}
		else {
			level.counts[state]++;
		}
	}

	level = {
		/**
		 * Create the walls, The whole game is a grid and walls are on the grid
		 * The walls are organised on a rectangle of the grid filling the screen
		 * Each wall is an instance of the class Entities.GridCell
		 */
		createLevel: function (data, levelIndex) {
			var col, row,
				level = new LevelClass(),
				map = data.maps[levelIndex];

			level.gridCellWidth = canvas.width() / map.width;
			level.gridCellHeight = canvas.height() / map.height;
			level.cells = [];
			level.width = map.width;
			level.height = map.height;
			level.counts = {};
			for (row = 0; row < map.height; row++ ) {
				for (col = 0; col < map.width; col++ ) {
					level.cells.push(new Entities.GridCell(
						// 5 is the initial left margin
						level.gridCellWidth * col, level.gridCellHeight * row,
						level.gridCellWidth, level.gridCellHeight,
						data.resources[map.map[row][col]].resource,
						// @TODO remove destructable field
						true, map.map[row][col]
					));

					_incrementStateCount(level, map.map[row][col]);

					if (map.map[row][col] == data.resourcesMap.TILE_START) {
						level.startX = level.gridCellWidth * col + level.gridCellWidth / 2;
						level.startY = level.gridCellHeight * row + level.gridCellHeight / 2;
					}
				}
			}

			return level;
		}
	};

	return level;
});

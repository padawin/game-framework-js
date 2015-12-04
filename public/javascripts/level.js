if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with physics calculations and collisions
 */
loader.addModule('Level',
'Canvas', 'Entities',
function (canvas, Entities) {
	"use strict";

	var level, LevelClass;

	LevelClass = function () {

	};

	LevelClass.prototype.getCell = function (col, row) {
		return this.cells[col + this.width * row];
	};

	// Reset the cells to the original state (all active)
	LevelClass.prototype.reset = function () {
		level.counts = {};
		for (var c = 0; c < this.cells.length; c++) {
			this.cells[c].reset();
			_incrementStateCount(level, this.cells[c].state);
		}
	};

	LevelClass.prototype.changeCellState = function (cellIndex, newState) {
		level.counts[this.cells[cellIndex].state]--;
		this.cells[cellIndex].state = newState;

		_incrementStateCount(level, newState);
	};

	LevelClass.prototype.getCoordinatesCenterCell = function (col, row) {
		return [
			this.gridCellWidth * col + this.gridCellWidth / 2,
			this.gridCellHeight * row + this.gridCellHeight / 2
		];
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
			for (row = 0; row < map.height; row++) {
				for (col = 0; col < map.width; col++) {
					var resource;
					if (data.resources && data.resources[map.map[row][col]]) {
						resource = data.resources[map.map[row][col]];
						if (typeof resource.background == 'number') {
							resource.background = data.resources[resource.background];
						}
					}

					level.cells.push(new Entities.GridCell(
						level.gridCellWidth * col, level.gridCellHeight * row,
						level.gridCellWidth, level.gridCellHeight,
						resource,
						map.map[row][col]
					));

					_incrementStateCount(level, map.map[row][col]);
				}
			}

			return level;
		}
	};

	return level;
});

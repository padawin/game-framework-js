if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with a level in the game
 * A level has a grid of cells
 */
loader.addModule('Level',
'Canvas', 'Entities',
function (canvas, Entities) {
	"use strict";

	var level, LevelClass;

	function _incrementStateCount (level, state) {
		if (!level.counts[state]) {
			level.counts[state] = 1;
		}
		else {
			level.counts[state]++;
		}
	}

	/**
	 * Class empty construct
	 */
	LevelClass = function () {

	};

	/**
	 * Method to get a cell from its coordinates (col, row)
	 */
	LevelClass.prototype.getCell = function (col, row) {
		return this.cells[col + this.width * row];
	};

	/**
	 * Reset the cells to the original state
	 * and reset also the count of states per cell.
	 */
	LevelClass.prototype.reset = function () {
		level.counts = {};
		for (var c = 0; c < this.cells.length; c++) {
			this.cells[c].reset();
			_incrementStateCount(level, this.cells[c].state);
		}
	};

	/**
	 * Returns an array with as first element the x position in pixels
	 * of the center of the cell in the grid and as second element
	 * the y position of the center of the cell in the grid.
	 */
	LevelClass.prototype.getCoordinatesCenterCell = function (col, row) {
		return [
			this.gridCellWidth * col + this.gridCellWidth / 2,
			this.gridCellHeight * row + this.gridCellHeight / 2
		];
	};

	/**
	 * Returns the grid coordinates of the cell containing the point (x, y).
	 */
	LevelClass.prototype.getGridCellcoodinatesAt = function (x, y) {
		return [
			Math.floor(x / this.gridCellWidth),
			Math.floor(y / this.gridCellHeight)
		];
	};

	/**
	 * Draws only the cells visible in the camera's scope.
	 * Computes the coordinates in the grid of the top left and bottom
	 * right corners of the camera, and loop through this interval of
	 * cells.
	 */
	LevelClass.prototype.draw = function (xInCamera, yInCamera, camera) {
		var topLeftGridCellCamera = this.getGridCellcoodinatesAt(camera.xWorld, camera.yWorld),
			bottomRightGridCellCamera = this.getGridCellcoodinatesAt(camera.xWorld + camera.w, camera.yWorld + camera.h),
			i, j, cell;

		for (j = topLeftGridCellCamera[1]; j <= bottomRightGridCellCamera[1]; j++) {
			for (i = topLeftGridCellCamera[0]; i <= bottomRightGridCellCamera[0]; i++) {
				cell = this.getCell(i, j);
				if (cell) {
					cell.draw(cell.x - xInCamera, cell.y - yInCamera);
				}
			}
		}
	};

	level = {
		/**
		 * STATIC METHOD
		 *
		 * Create the walls, The whole game is a grid and walls are on the grid
		 * The walls are organised on a rectangle of the grid filling the screen
		 * Each wall is an instance of the class Entities.GridCell
		 */
		createLevel: function (data, levelIndex, cellDimensions) {
			var col, row,
				level = new LevelClass(),
				map = data.maps[levelIndex];

			level.gridCellWidth = cellDimensions[0];
			level.gridCellHeight = cellDimensions[1];
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
					else {
						resource = null;
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

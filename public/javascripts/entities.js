if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Car, Paddle and GridCell entities
 */
loader.addModule('Entities',
'Canvas',
function (canvas) {
	var entities = {},
		GridCell;

	(function () {
		/* GridCell Class */
		GridCell = function (x, y, w, h, texture, destructible, state) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.texture = texture;
			this.state = this.originalState = state;
			this.destructible = this.originalDestructible = destructible;
		}

		/**
		 * Draw the gridCell on the screen
		 */
		GridCell.prototype.draw = function () {
			if (this.texture && typeof this.texture == 'object') {
				canvas.drawTexture(this.texture, this.x, this.y, this.w, this.h);
			}
			else if (this.texture && typeof this.texture == 'string') {
				canvas.drawRectangle(this.x, this.y, this.w, this.h, this.texture);
			}
		};

		/**
		 * Reset the gridCell to its original values
		 */
		GridCell.prototype.reset = function () {
			this.state = this.originalState;
			this.destructible = this.originalDestructible;
		};
		/* End GridCell Class */
	})();

	entities.GridCell = GridCell;

	return entities;
});

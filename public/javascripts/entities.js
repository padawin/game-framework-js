if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the GridCell entities
 */
loader.addModule('Entities',
'Canvas',
function (canvas) {
	"use strict";

	var entities = {},
		GridCell;

	/**
	 * Module to manage the grid cells of a game, A cell has a tuple of
	 * coordinates x and y, a width and height, a texture (which can
	 * either be a resource or a rgb color as string) and a state being
	 * an integer corresponding to the index of the state's resource in
	 * the data module
	 */
	(function () {
		/**
		 * GridCell Class construct
		 */
		GridCell = function (x, y, w, h, texture, state) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.texture = this.originalTexture = texture;
			this.state = this.originalState = state;
		};

		/**
		 * Draw the gridCell on the screen
		 */
		GridCell.prototype.draw = function (x, y) {
			if (this.texture && typeof this.texture.resource == 'object') {
				if (this.texture.texture) {
					canvas.drawTexture(this.texture.resource, x, y, this.w, this.h);
				}
				else {
					if (this.texture.background !== undefined) {
						canvas.drawTexture(this.texture.background.resource, x, y, this.w, this.h);
					}

					canvas.drawImage(
						this.texture.resource,
						x + (this.w - this.texture.resource.width) / 2,
						y + (this.h - this.texture.resource.height) / 2
					);
				}
			}
			else if (this.texture && typeof this.texture.resource == 'string') {
				canvas.drawRectangle(x, y, this.w, this.h, this.texture.resource);
			}
		};

		/**
		 * Reset the gridCell to its original values
		 */
		GridCell.prototype.reset = function () {
			this.state = this.originalState;
			this.texture = this.originalTexture;
		};

		/**
		 * Change a cell's state and texture. A cell cannot change of
		 * state without changing its texture
		 */
		GridCell.prototype.changeStateAndTexture = function (newState, newTexture) {
			this.state = newState;
			this.texture = newTexture;
		};
		/* End GridCell Class */
	})();

	entities.GridCell = GridCell;

	return entities;
});

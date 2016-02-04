if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the GridCell entities
 */
loader.addModule('Entities',
'Canvas', 'Behaviour',
function (canvas, Behaviour) {
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
			this.graphic = this.originalTexture = texture;
			this.state = this.originalState = state;

			if (this.graphic.animations) {
				Behaviour.setBehaviours(this, ['animated']);
				Behaviour.animated.setAnimation(this, 'default');
			}
		};

		/**
		 * Draw the gridCell on the screen
		 */
		GridCell.prototype.draw = function (x, y) {
			if (this.graphic && typeof this.graphic.resource == 'object') {
				if (this.graphic.texture) {
					canvas.drawTexture(this.graphic.resource, x, y, this.w, this.h);
				}
				else {
					if (this.graphic.background !== undefined) {
						canvas.drawTexture(this.graphic.background.resource, x, y, this.w, this.h);
					}

					if (this.graphic.animations) {
						Behaviour.animated.draw(this, x, y);
					}
					else {
						canvas.drawImage(
							this.graphic.resource,
							x + (this.w - this.graphic.resource.width) / 2,
							y + (this.h - this.graphic.resource.height) / 2
						);
					}
				}
			}
			else if (this.graphic && typeof this.graphic.resource == 'string') {
				canvas.drawRectangle(x, y, this.w, this.h, this.graphic.resource);
			}
		};

		/**
		 * Reset the gridCell to its original values
		 */
		GridCell.prototype.reset = function () {
			this.state = this.originalState;
			this.graphic = this.originalTexture;
		};

		/**
		 * Change a cell's state and texture. A cell cannot change of
		 * state without changing its texture
		 */
		GridCell.prototype.changeStateAndTexture = function (newState, newTexture) {
			this.state = newState;
			this.graphic = newTexture;
		};
		/* End GridCell Class */
	})();

	entities.GridCell = GridCell;

	return entities;
});

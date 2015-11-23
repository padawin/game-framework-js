if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Ball, Paddle and GridCell entities
 */
loader.addModule('Entities',
'Canvas', 'B',
function (canvas, B) {
	var entities = {},
		Ball,
		GridCell,
		Paddle;

	(function () {
		/* Ball Class */
		Ball = function (x, y, r, speedX, speedY) {
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = r;
			this.speedX = this.originalSpeedX = speedX;
			this.speedY = this.originalSpeedY = speedY;
		};

		/**
		 * Method to update the ball position according to its speed
		 */
		Ball.prototype.updatePosition = function () {
			this.x += this.speedX;
			this.y += this.speedY;
		};

		/**
		 * Reset the ball to its original values
		 */
		Ball.prototype.reset = function () {
			this.x  = this.originalX;
			this.y = this.originalY;
			this.speedX = this.originalSpeedX;
			this.speedY = this.originalSpeedY;
		};

		/**
		 * Draw the ball on the screen
		 */
		Ball.prototype.draw = function () {
			canvas.drawCircle(this.x, this.y, this.r, 'white');
		};
		/* End Ball Class */
	})();

	(function () {
		/* Paddle Class */
		Paddle = function (x, y, w, h) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
		}

		/**
		 * Method to update the ball position according to a given x position
		 */
		Paddle.prototype.updatePosition = function (x) {
			this.x = x;
		};

		/**
		 * Draw the paddle on the screen
		 */
		Paddle.prototype.draw = function () {
			canvas.drawRectangle(this.x, this.y, this.w, this.h, 'white');
		};
		/* End Paddle Class */
	})();

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
			if (this.state == GridCell.STATE_ACTIVE) {
				canvas.drawRectangle(this.x, this.y, this.w, this.h, 'red');
			}
		};

		/**
		 * Reset the gridCell to its original values
		 */
		GridCell.prototype.reset = function () {
			this.state = this.originalState;
			this.destructible = this.originalDestructible;
		};

		GridCell.STATE_INACTIVE = 0;
		GridCell.STATE_ACTIVE = 1;
		GridCell.STATE_START = 2;
		/* End GridCell Class */
	})();

	entities.Ball = Ball;
	entities.Paddle = Paddle;
	entities.GridCell = GridCell;

	return entities;
});

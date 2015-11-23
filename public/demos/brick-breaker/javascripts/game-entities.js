if (typeof (require) != 'undefined') {
	var loader = require('../../../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Ball and Paddle entities
 */
loader.addModule('GameEntities',
'Canvas',
function (canvas) {
	var entities = {},
		Ball,
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

	entities.Ball = Ball;
	entities.Paddle = Paddle;

	return entities;
});

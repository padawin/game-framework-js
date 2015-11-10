if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Ball, Paddle and Brick entities
 */
loader.addModule('Entities',
'Canvas', 'B',
function (canvas, B) {
	var entities = {},
		Ball,
		Brick,
		Paddle;

	(function () {
		/* Ball Class */
		Ball = function (x, y, r, speedX, speedY) {
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = r;
			this.speedX = this.originalSpeedX = speedX;
			this.speedY = this.originalSpeedY = speedY;

			// Position of the ball in the grid
			this.setGridCoordinates();
		};

		/**
		 * Method to detect if the ball hits one of the screen's edge.
		 * If it does, its speed is changed accordingly
		 */
		function _ballDetectScreenEdgeCollision (ball) {
			ball.oldGridCellCol = ball.gridCellCol;
			ball.oldGridCellRow = ball.gridCellRow;
			ball.setGridCoordinates();

			// This deals with the screen's edges
			if (ball.x - ball.r < 0 || ball.x + ball.r > canvas.width()) {
				ball.x = Math.min(Math.max(ball.r, ball.x), canvas.width() - ball.r);
				ball.speedX *= -1;
			}
			if (ball.y - ball.r < 0) {
				ball.y = ball.r;
				ball.speedY *= -1;
			}
			// The ball touches the bottom screen
			if (ball.y + ball.r > canvas.height()) {
				ball.reset();
				console.log('fire lost');
				B.Events.fire('lost');
			}
		}

		/**
		 * From the ball coordinates, set
		 */
		Ball.prototype.setGridCoordinates = function () {
			this.gridCellCol = Math.floor(this.x / BRICK_SPACE_WIDTH);
			this.gridCellRow = Math.floor(this.y / BRICK_SPACE_HEIGHT);
		};

		/**
		 * Method to update the ball position according to its speed
		 */
		Ball.prototype.updatePosition = function () {
			this.x += this.speedX;
			this.y += this.speedY;

			// Update the ball's speed if it collides with the screen edges
			_ballDetectScreenEdgeCollision(this);
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
		/* Brick Class */
		Brick = function (x, y, w, h, destructible, state) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.state = this.originalState = state;
			this.destructible = this.originalDestructible = destructible;
		}

		/**
		 * Draw the brick on the screen
		 */
		Brick.prototype.draw = function () {
			if (this.state == Brick.STATE_ACTIVE) {
				canvas.drawRectangle(this.x, this.y, this.w, this.h, 'red');
			}
		};

		/**
		 * Reset the brick to its original values
		 */
		Brick.prototype.reset = function () {
			this.state = this.originalState;
			this.destructible = this.originalDestructible;
		};

		Brick.STATE_INACTIVE = 0;
		Brick.STATE_ACTIVE = 1;
		Brick.STATE_START = 2;
		/* End Brick Class */
	})();

	entities.Ball = Ball;
	entities.Paddle = Paddle;
	entities.Brick = Brick;

	return entities;
});

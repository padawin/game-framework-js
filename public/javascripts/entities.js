if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
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

	/* Ball Class */
	Ball = function (x, y, speedX, speedY) {
		this.x  = this.originalX = x;
		this.y = this.originalY = y;
		this.speedX = this.originalSpeedX = speedX;
		this.speedY = this.originalSpeedY = speedY;

		// Position of the ball in the grid
		this.gridCellCol = Math.floor(this.x / BRICK_SPACE_WIDTH);
		this.gridCellRow = Math.floor(this.y / BRICK_SPACE_HEIGHT);
	};

	/**
	 * Method to detect if the ball hits one of the screen's edge.
	 * If it does, its speed is changed accordingly
	 */
	function _ballDetectScreenEdgeCollision (ball) {
		ball.oldGridCellCol = ball.gridCellCol;
		ball.oldGridCellRow = ball.gridCellRow;
		ball.gridCellCol = Math.floor(ball.x / BRICK_SPACE_WIDTH);
		ball.gridCellRow = Math.floor(ball.y / BRICK_SPACE_HEIGHT);

		// This deals with the screen's edges
		if (ball.x - BALL_RADIUS < 0 || ball.x + BALL_RADIUS > canvas.width()) {
			ball.x = Math.min(Math.max(BALL_RADIUS, ball.x), canvas.width() - BALL_RADIUS);
			ball.speedX *= -1;
		}
		if (ball.y - BALL_RADIUS < 0) {
			ball.y = BALL_RADIUS;
			ball.speedY *= -1;
		}
		// The ball touches the bottom screen
		if (ball.y + BALL_RADIUS > canvas.height()) {
			ball.reset();
			console.log('fire lost');
			B.Events.fire('lost');
		}
	}

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
		canvas.drawCircle(this.x, this.y, BALL_RADIUS, 'white');
	};
	/* End Ball Class */

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
		if (this.state == BRICK_STATE_ACTIVE) {
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
	/* End Brick Class */

	entities.Ball = Ball;
	entities.Paddle = Paddle;
	entities.Brick = Brick;

	return entities;
});

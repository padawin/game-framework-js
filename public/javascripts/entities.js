if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

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

		this.gridCellCol = Math.floor(this.x / BRICK_SPACE_WIDTH);
		this.gridCellRow = Math.floor(this.y / BRICK_SPACE_HEIGHT);
	};

	Ball.prototype.updatePosition = function () {
		this.x += this.speedX;
		this.y += this.speedY;

		this.oldGridCellCol = this.gridCellCol;
		this.oldGridCellRow = this.gridCellRow;
		this.gridCellCol = Math.floor(this.x / BRICK_SPACE_WIDTH);
		this.gridCellRow = Math.floor(this.y / BRICK_SPACE_HEIGHT);

		// This deals with the screen's edges
		if (this.x - BALL_RADIUS < 0 || this.x + BALL_RADIUS > canvas.width()) {
			this.x = Math.min(Math.max(BALL_RADIUS, this.x), canvas.width() - BALL_RADIUS);
			this.speedX *= -1;
		}
		if (this.y - BALL_RADIUS < 0) {
			this.y = BALL_RADIUS;
			this.speedY *= -1;
		}
		// The ball touches the bottom screen
		if (this.y + BALL_RADIUS > canvas.height()) {
			this.reset();
			console.log('fire lost');
			B.Events.fire('lost');
		}
	};

	Ball.prototype.reset = function () {
		this.x  = this.originalX;
		this.y = this.originalY;
		this.speedX = this.originalSpeedX;
		this.speedY = this.originalSpeedY;
	};

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

	Paddle.prototype.updatePosition = function (x) {
		this.x = x;
	};

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

	Brick.prototype.draw = function () {
		if (this.state == BRICK_STATE_ACTIVE) {
			canvas.drawRectangle(this.x, this.y, this.w, this.h, 'red');
		}
	};

	Brick.prototype.reset = function () {
		this.state = this.originalState;
		this.destructible = this.originalDestructible;
	};

	Brick.colRowToIndex = function (col, row) {
		return col - BRICK_GRID_START_COL +
			(BRICK_GRID_COL - BRICK_GRID_START_COL) * (row - BRICK_GRID_START_ROW);
	};
	/* End Brick Class */

	entities.Ball = Ball;
	entities.Paddle = Paddle;
	entities.Brick = Brick;

	return entities;
});

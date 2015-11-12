if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Car, Paddle and GridCell entities
 */
loader.addModule('Entities',
'Canvas', 'B',
function (canvas, B) {
	var entities = {},
		Car,
		GridCell,
		Paddle;

	(function () {
		var _power = 0.2,
			_reverse = 0.2,
			_turnRate = 0.05,
			_friction = 0.98,
			_radius = 10,
			// the car knows it is in a grid, but does not know anything
			// about the grid by default
			_gridCellWidth,
			_gridCellHeight;

		/**
		 * Set the car's position in the grid
		 */
		function _setGridCoordinates (car) {
			car.oldGridCellCol = car.gridCellCol;
			car.oldGridCellRow = car.gridCellRow;
			car.gridCellCol = Math.floor(car.x / _gridCellWidth);
			car.gridCellRow = Math.floor(car.y / _gridCellHeight);
		};

		/* Car Class */
		Car = function (x, y, angle, speed) {
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = _radius;
			this.angle = this.originalAngle = angle;
			this.speed = this.originalSpeed = speed;
			this.maxSpeed = 15;
			this.minSpeed = -15;
			this.graphicLoaded = false;
			this.isSteeringLeft = false;
			this.isSteeringRight = false;
			this.gas = false;
			this.isReversing = false;
		};

		Car.setGridCellDimensions = function (width, height) {
			_gridCellWidth = width;
			_gridCellHeight = height;
		};

		Car.prototype.steerLeft = function (enable) {
			this.isSteeringLeft = enable;
		};

		Car.prototype.steerRight = function (enable) {
			this.isSteeringRight = enable;
		};

		Car.prototype.accelerate = function (enable) {
			this.gas = enable;
		};

		Car.prototype.reverse = function (enable) {
			this.isReversing = enable;
		};

		/**
		 * Method to update the car position according to its speed
		 */
		Car.prototype.updatePosition = function () {
			// friction
			this.speed *= 0.98;
			if (this.speed < 0.1) {
				this.speed = 0;
			}
			if (this.gas) {
				this.speed = Math.min(this.speed + _power, this.maxSpeed);
			}
			if (this.isReversing) {
				this.speed = Math.max(this.speed - _reverse, this.minSpeed);
			}
			if (this.isSteeringLeft) {
				this.angle -= _turnRate;
			}
			if (this.isSteeringRight) {
				this.angle += _turnRate;
			}

			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;

			_setGridCoordinates(this);
		};

		Car.prototype.bumpBack = function () {
			this.x -= Math.cos(this.angle) * this.speed;
			this.y -= Math.sin(this.angle) * this.speed;

			this.speed *= -0.5;
		};

		Car.prototype.setGraphic = function (graphic) {
			this.graphic = graphic;
		};

		Car.prototype.setGraphicLoaded = function (loaded) {
			this.graphicLoaded = loaded;
		};

		/**
		 * Reset the car to its original values
		 */
		Car.prototype.reset = function () {
			this.x  = this.originalX;
			this.y = this.originalY;
			this.angle = this.originalAngle;
			this.speed = this.originalSpeed;
		};

		/**
		 * Draw the car on the screen
		 */
		Car.prototype.draw = function () {
			if (this.graphicLoaded) {
				canvas.drawRotatedImage(this.graphic, this.x, this.y, this.angle);
			}

		};
		/* End Car Class */
	})();

	(function () {
		/* GridCell Class */
		GridCell = function (x, y, w, h, destructible, state) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
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

	entities.Car = Car;
	entities.Paddle = Paddle;
	entities.GridCell = GridCell;

	return entities;
});

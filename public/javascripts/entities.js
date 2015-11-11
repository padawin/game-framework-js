if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Car, Paddle and Track entities
 */
loader.addModule('Entities',
'Canvas', 'B',
function (canvas, B) {
	var entities = {},
		Car,
		Track,
		Paddle;

	(function () {
		/* Car Class */
		Car = function (x, y, r, angle, speed) {
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = r;
			this.angle = angle;
			this.speed = this.originalSpeed = speed;
			this.maxSpeed = 15;
			this.minSpeed = -15;
			this.graphicLoaded = false;
			this.isSteeringLeft = false;
			this.isSteeringRight = false;
			this.gas = false;
			this.isReversing = false;
		};

		/**
		 * From the car coordinates, set
		 */
		Car.prototype.setGridCoordinates = function (gridCellWidth, gridCellHeight) {
			this.oldGridCellCol = this.gridCellCol;
			this.oldGridCellRow = this.gridCellRow;
			this.gridCellCol = Math.floor(this.x / gridCellWidth);
			this.gridCellRow = Math.floor(this.y / gridCellHeight);
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
			if (this.gas) {
				this.speed = Math.min(this.speed + 0.2, this.maxSpeed);
			}
			if (this.isReversing) {
				this.speed = Math.max(this.speed - 0.2, this.minSpeed);
			}
			if (this.isSteeringLeft) {
				this.angle -= 0.05;
			}
			if (this.isSteeringRight) {
				this.angle += .05;
			}

			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;
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
		/* Track Class */
		Track = function (x, y, w, h, destructible, state) {
			this.x = x;
			this.y = y;
			this.w = w;
			this.h = h;
			this.state = this.originalState = state;
			this.destructible = this.originalDestructible = destructible;
		}

		/**
		 * Draw the track on the screen
		 */
		Track.prototype.draw = function () {
			if (this.state == Track.STATE_ACTIVE) {
				canvas.drawRectangle(this.x, this.y, this.w, this.h, 'red');
			}
		};

		/**
		 * Reset the track to its original values
		 */
		Track.prototype.reset = function () {
			this.state = this.originalState;
			this.destructible = this.originalDestructible;
		};

		Track.STATE_INACTIVE = 0;
		Track.STATE_ACTIVE = 1;
		Track.STATE_START = 2;
		/* End Track Class */
	})();

	entities.Car = Car;
	entities.Paddle = Paddle;
	entities.Track = Track;

	return entities;
});

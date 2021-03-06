"use strict";

if (typeof (require) != 'undefined') {
	var loader = require('../../../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Car entitie
 */
loader.addModule('GameEntities',
'Canvas',
function (canvas) {
	var entities = {},
		Car;

	(function () {
		var _power = 0.2,
			_reverse = 0.2,
			_turnRate = 0.05,
			_friction = 0.98,
			_radius = 10;

		/* Car Class */
		Car = function (name, x, y, angle) {
			this.name = name;
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = _radius;
			this.angle = this.originalAngle = angle;
			this.speed = this.originalSpeed = 0;
			this.maxSpeed = 15;
			this.minSpeed = -15;
			this.graphicLoaded = false;
			this.isSteeringLeft = false;
			this.isSteeringRight = false;
			this.gas = false;
			this.isReversing = false;
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
			if (Math.abs(this.speed) < 0.1) {
				this.speed = 0;
			}
			if (this.gas) {
				this.speed = Math.min(this.speed + _power, this.maxSpeed);
			}
			if (this.isReversing) {
				this.speed = Math.max(this.speed - _reverse, this.minSpeed);
			}

			if (Math.abs(this.speed) > 0.0 && this.isSteeringLeft) {
				this.angle -= _turnRate;
			}
			if (Math.abs(this.speed) > 0.0 && this.isSteeringRight) {
				this.angle += _turnRate;
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
			canvas.drawRotatedImage(this.graphic, this.x, this.y, this.angle);
		};
		/* End Car Class */
	})();

	entities.Car = Car;

	return entities;
});

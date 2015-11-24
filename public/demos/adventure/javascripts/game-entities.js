if (typeof (require) != 'undefined') {
	var loader = require('../../../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Warrior entitie
 */
loader.addModule('GameEntities',
'Canvas',
function (canvas) {
	var entities = {},
		Warrior;

	(function () {
		var _power = 0.2,
			_reverse = 0.2,
			_turnRate = 0.05,
			_friction = 0.98,
			_radius = 10;

		/* Warrior Class */
		Warrior = function (name, x, y) {
			this.name = name;
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = _radius;
			this.angle = this.originalAngle = 0;
			this.speed = this.originalSpeed = 0;
			this.maxSpeed = 15;
			this.minSpeed = -15;
			this.graphicLoaded = false;
			this.isSteeringLeft = false;
			this.isSteeringRight = false;
			this.gas = false;
			this.isReversing = false;
		};

		Warrior.prototype.steerLeft = function (enable) {
			this.isSteeringLeft = enable;
		};

		Warrior.prototype.steerRight = function (enable) {
			this.isSteeringRight = enable;
		};

		Warrior.prototype.accelerate = function (enable) {
			this.gas = enable;
		};

		Warrior.prototype.reverse = function (enable) {
			this.isReversing = enable;
		};

		/**
		 * Method to update the warrior position according to its speed
		 */
		Warrior.prototype.updatePosition = function () {
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

		Warrior.prototype.bumpBack = function () {
			this.x -= Math.cos(this.angle) * this.speed;
			this.y -= Math.sin(this.angle) * this.speed;

			this.speed *= -0.5;
		};

		Warrior.prototype.setGraphic = function (graphic) {
			this.graphic = graphic;
		};

		/**
		 * Reset the warrior to its original values
		 */
		Warrior.prototype.reset = function () {
			this.x  = this.originalX;
			this.y = this.originalY;
			this.angle = this.originalAngle;
			this.speed = this.originalSpeed;
		};

		/**
		 * Draw the warrior on the screen
		 */
		Warrior.prototype.draw = function () {
			canvas.drawRotatedImage(this.graphic, this.x, this.y, this.angle);
		};
		/* End Warrior Class */
	})();

	entities.Warrior = Warrior;

	return entities;
});

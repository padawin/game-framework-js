"use strict";

if (typeof (require) != 'undefined') {
	var loader = require('../../../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * This module contains the definition of the Ship entitie
 */
loader.addModule('GameEntities',
'Canvas',
function (canvas) {
	var entities = {},
		Ship;

	(function () {
		var _turnRate = 0.05,
			_maxLeftAngle = 2 * Math.PI / 3,
			_maxRightAngle = Math.PI / 3;

		/* Ship Class */
		Ship = function (x, y, angle) {
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.angle = this.originalAngle = angle;
			this.speed = this.originalSpeed = 10;
			this.maxSpeed = 15;
			this.minSpeed = -15;
			this.graphicLoaded = false;
			this.isSteeringLeft = false;
			this.isSteeringRight = false;
			this.gas = false;
			this.isReversing = false;
		};

		Ship.prototype.steerLeft = function (enable) {
			this.isSteeringLeft = enable;
		};

		Ship.prototype.steerRight = function (enable) {
			this.isSteeringRight = enable;
		};

		/**
		 * Method to update the ship position according to its speed
		 */
		Ship.prototype.updatePosition = function () {

			if (Math.abs(this.speed) > 0.0 && this.isSteeringLeft) {
				this.angle = Math.min(this.angle + _turnRate, _maxLeftAngle);
			}
			if (Math.abs(this.speed) > 0.0 && this.isSteeringRight) {
				this.angle = Math.max(this.angle - _turnRate, _maxRightAngle);
			}

			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;

			this._tick++;
			if (this._tick == this._timePerFrame) {
				this._tick = 0;
				this._frame = (this._frame + 1) % this._framesNb;
			}

		};

		Ship.prototype.setGraphic = function (graphic) {
			this.graphic = graphic;
			this.setAnimation('fly');
		};

		/**
		 * Reset the ship to its original values
		 */
		Ship.prototype.reset = function () {
			this.x  = this.originalX;
			this.y = this.originalY;
			this.angle = this.originalAngle;
			this.speed = this.originalSpeed;
		};

		/**
		 * Set the ship's animation
		 */
		Ship.prototype.setAnimation = function (animation) {
			this.animation = animation;
			this._frame = 0;
			this._tick = 0;
			this._timePerFrame = this.graphic.animations[this.animation].timePerFrame;
			this._frames = this.graphic.animations[this.animation].frames;
			this._framesNb = this._frames.length;
		};

		/**
		 * Draw the ship on the screen
		 */
		Ship.prototype.draw = function (x, y) {
			canvas.drawImage(
				this.graphic.resource,
				x - this._frames[this._frame].w / 2,
				y - this._frames[this._frame].h / 2,
				this._frames[this._frame]
			);
		};
		/* End Ship Class */
	})();

	entities.Ship = Ship;

	return entities;
});

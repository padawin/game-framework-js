"use strict"

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
		var _radius = 10;

		/* Warrior Class */
		Warrior = function (name, x, y) {
			this.name = name;
			this.keys = 0;
			this.x = this.originalX = x;
			this.y = this.originalY = y;
			this.r = _radius;
			this.angle = this.originalAngle = 0;
			this.speed = this.originalSpeed = 0;
			this.graphicLoaded = false;
		};

		function _walk (warrior, enable) {
			if (enable && warrior.speed !== 0) {
				// already walking
				return;
			}
			else if (enable) {
				warrior.speed = 5;
				warrior.setAnimation('walk');
			}
			else {
				warrior.speed = 0;
				warrior.setAnimation('stand');
			}
		}

		Warrior.prototype.walkLeft = function (enable) {
			_walk(this, enable);
			this.angle = Math.PI;
		};

		Warrior.prototype.walkRight = function (enable) {
			_walk(this, enable);
			this.angle = 0;
		};

		Warrior.prototype.walkUp = function (enable) {
			_walk(this, enable);
			this.angle = 3 * Math.PI / 2;
		};

		Warrior.prototype.walkDown = function (enable) {
			_walk(this, enable);
			this.angle = Math.PI / 2;
		};

		/**
		 * Method to update the warrior position according to its speed
		 */
		Warrior.prototype.updatePosition = function () {
			this.x += Math.cos(this.angle) * this.speed;
			this.y += Math.sin(this.angle) * this.speed;

			this._tick++;
			if (this._tick == this._timePerFrame) {
				this._tick = 0;
				this._frame = (this._frame + 1) % this._framesNb;
			}
		};

		Warrior.prototype.bumpBack = function () {
			this.x -= Math.cos(this.angle) * this.speed;
			this.y -= Math.sin(this.angle) * this.speed;

			this.speed = 0;
		};

		Warrior.prototype.setGraphic = function (graphic) {
			this.graphic = graphic;
			this.setAnimation('stand');
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
		 * Set the warrior's animation
		 */
		Warrior.prototype.setAnimation = function (animation) {
			this.animation = animation;
			this._frame = 0;
			this._tick = 0;
			this._timePerFrame = this.graphic.animations[this.animation].timePerFrame;
			this._frames = this.graphic.animations[this.animation].frames;
			this._framesNb = this._frames.length;
		};

		/**
		 * Draw the warrior on the screen
		 */
		Warrior.prototype.draw = function (x, y) {
			canvas.drawImage(
				this.graphic.resource,
				x - this._frames[this._frame].w / 2,
				y - this._frames[this._frame].h / 2,
				this._frames[this._frame]
			);
		};

		Warrior.prototype.addKey = function () {
			this.keys++;
		};

		Warrior.prototype.useKey = function () {
			this.keys--;
		};

		Warrior.prototype.getNumberOfKeys = function () {
			return this.keys;
		};
		/* End Warrior Class */
	})();

	entities.Warrior = Warrior;

	return entities;
});

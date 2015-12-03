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
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = _radius;
			this.angle = this.originalAngle = 0;
			this.speed = this.originalSpeed = 0;
			this.graphicLoaded = false;
		};

		function _walk (warrior, enable) {
			warrior.speed = enable ? 5 : 0;
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
		};

		Warrior.prototype.bumpBack = function () {
			this.x -= Math.cos(this.angle) * this.speed;
			this.y -= Math.sin(this.angle) * this.speed;

			this.speed = 0;
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
			canvas.drawImage(
				this.graphic,
				this.x - this.graphic.width / 2,
				this.y - this.graphic.height / 2
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

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
		Car = function (x, y, r, speedX, speedY) {
			this.x  = this.originalX = x;
			this.y = this.originalY = y;
			this.r = r;
			this.speedX = this.originalSpeedX = speedX;
			this.speedY = this.originalSpeedY = speedY;
			this.graphicLoaded = false;
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

		/**
		 * Method to update the car position according to its speed
		 */
		Car.prototype.updatePosition = function () {
			this.x += this.speedX;
			this.y += this.speedY;
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
			this.speedX = this.originalSpeedX;
			this.speedY = this.originalSpeedY;
		};

		/**
		 * Draw the car on the screen
		 */
		Car.prototype.draw = function () {
			if (this.graphicLoaded) {
				canvas.drawImage(
					this.graphic,
					this.x - this.graphic.width / 2,
					this.y - this.graphic.height / 2)
				;
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

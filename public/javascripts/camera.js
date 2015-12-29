if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to manage a camera to display just a part of the level
 */
loader.addModule('Camera',
'B', 'Canvas',
function (B, canvas) {
	"use strict";

	var camera;

	/**
	 * Constructor to instanciate a camera
	 *
	 * A camera has:
	 * - a pair of coordinates in the world (the part of the world it
	 * 	shows):
	 * 		cameraXInWorld, cameraYInWorld
	 * - a pair of coordinates in the screen (where in the canvas the
	 * 	camera must be displayed):
	 * 		cameraX, cameraY
	 * - a touple width and height (size of the camera in the screen)
	 * 		cameraWidth, cameraHeight
	 */
	camera = function (
		cameraXInWorld, cameraYInWorld,
		cameraX, cameraY, cameraWidth, cameraHeight
	) {
		this.xWorld = cameraXInWorld;
		this.yWorld = cameraYInWorld;
		this.x = cameraX;
		this.y = cameraY;
		this.w = cameraWidth;
		this.h = cameraHeight;
	};

	/**
	 * A camera is a drawable element (can be added to the list of
	 * elements to draw in the engine), so it needs a draw method which
	 * draws the limits of the camera (eg. recovers what is not supposed
	 * to be shown on screen with white)
	 */
	camera.prototype.draw = function () {
		// @XXX see if it is possible to draw an inverted rectangle
		// Until then, draw 4 white rectangle around the camera area

		// @TODO handle the fact that the camera must not be bigger than
		// the screen
		if (this.y > 0) {
			canvas.drawRectangle(0, 0, canvas.width(), this.y, 'white');
		}

		if (this.y + this.h < canvas.height()) {
			canvas.drawRectangle(
				0, this.y + this.h,
				canvas.width(), canvas.height() - this.y - this.h,
				'white'
			);
		}

		if (this.x > 0) {
			canvas.drawRectangle(
				0, 0, this.x, canvas.height(), 'white'
			);
		}

		if (this.x + this.w < canvas.width()) {
			canvas.drawRectangle(
				this.x + this.w, 0,
				canvas.width() - this.x - this.w, canvas.height(),
				'white'
			);
		}
	};

	return camera;
});


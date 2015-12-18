if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to manage a camera to display just a part of the map
 */
loader.addModule('Camera',
'B', 'Canvas',
function (B, canvas) {
	"use strict";

	var camera;

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

	camera.prototype.draw = function () {
		// @XXX see if it is possible to draw an inverted rectangle
		// Until then, draw 4 white rectangle around the camera area

		// @TODO handle the fact that the camera must not be bigger than
		// the screen
		if (this.y > 0) {
			canvas.drawRectangle(0, 0, canvas.width(), this.y, 'white');
		}

		if (this.y + this.h < canvas.height()) {
			canvas.drawRectangle(0, this.y + this.h, canvas.width(), canvas.height() - this.y - this.h, 'white');
		}

		if (this.x > 0) {
			canvas.drawRectangle(0, 0, this.x, canvas.height(), 'white');
		}

		if (this.x + this.w < canvas.width()) {
			canvas.drawRectangle(this.x + this.w, 0, canvas.width() - this.x - this.w, canvas.height(), 'white');
		}
	};

	return camera;
});


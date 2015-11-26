"use strict";

if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to manage a camera to display just a part of the map
 */
loader.addModule('Camera',
'B',
function (B) {
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

	return camera;
});


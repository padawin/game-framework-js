if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

loader.addModule('Canvas',
function () {
	"use strict";

	var canvas,
		canvasContext,
		canvasModule;

	/**
	 * Module to display things in canvas, this is just an interface
	 * to the canvas API
	 */
	canvasModule = {
		/**
		 * Method to initialise the canvas and set the mouse events
		 */
		init: function (element) {
			canvas = element;
			canvasContext = canvas.getContext('2d');
		},

		/**
		 * Method to draw a rectangle
		 */
		drawRectangle: function (x, y, width, height, fillColor, strokeColor) {
			if (fillColor) {
				canvasContext.fillStyle = fillColor;
				canvasContext.fillRect(x, y, width, height);
			}
			if (strokeColor) {
				canvasContext.strokeStyle = strokeColor;
				canvasContext.strokeRect(x, y, width, height);
			}
		},

		/**
		 * Method to draw a circle
		 */
		drawCircle: function (x, y, radius, color) {
			canvasContext.fillStyle = color;
			canvasContext.beginPath();
			canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
			canvasContext.fill();
		},

		/**
		 * Method to draw some text
		 */
		drawText: function (text, x, y, color) {
			canvasContext.fillStyle = color;
			canvasContext.fillText(text, x, y);
		},

		/**
		 * Method to draw an image
		 */
		drawImage: function (image, x, y) {
			canvasContext.drawImage(image, x, y);
		},

		/**
		 * Method to draw a repeated image
		 */
		drawTexture: function (image, x, y, w, h) {
			var pattern = canvasContext.createPattern(image, 'repeat');
			canvasContext.fillStyle = pattern;
			canvasContext.fillRect(x, y, w, h);
		},

		/**
		 * Method to draw a rotated image
		 */
		drawRotatedImage: function (image, x, y, angle) {
			canvasContext.save();
			canvasContext.translate(x, y);
			canvasContext.rotate(angle);
			canvasContext.drawImage(image, -image.width / 2, -image.height / 2);
			canvasContext.restore();
		},

		/**
		 * Method to draw a line
		 */
		line: function (from, to) {
			canvasContext.strokeStyle = 'white';
			canvasContext.beginPath();
			canvasContext.moveTo(from[0], from[1]);
			canvasContext.lineTo(to[0], to[1]);
			canvasContext.stroke();
		},

		/**
		 * Method to get the canvas's width
		 */
		width: function () {
			return canvas.width;
		},

		/**
		 * Clear the screen by displaying a rectangle covering the
		 * canvas area.
		 *
		 * The rectangle's color can be provided. white is used by default
		 */
		clearScreen: function (color) {
			color = color || 'white';
			canvasModule.drawRectangle(0, 0, canvas.width, canvas.height, color);
		},

		/**
		 * Method to get the canvas's height
		 */
		height: function () {
			return canvas.height;
		},

		/**
		 * Draw a list of elements
		 * Every element's coordinate is relative to the world, so
		 * the startPosition argument is supposed to be an object with
		 * the coordinates of where to start to draw the elements in the
		 * world to convert the world coordinates into camera
		 * coordinates
		 */
		drawAll: function (startPosition, all) {
			function _subDrawAll (all) {
				var a;
				for (a = 0; a < all.length; a++) {
					if (all[a].length) {
						_subDrawAll(all[a]);
					}
					else {
						var x = all[a].x,
							y = all[a].y;
						if (typeof startPosition == 'object') {
							x -= startPosition.x;
							y -= startPosition.y;
						}
						all[a].draw(x, y);
					}
				}
			}

			_subDrawAll(all);
		}
	};

	return canvasModule;
});

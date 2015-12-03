"use strict";

if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

loader.addModule('Canvas',
'B',
function (B) {
	var canvas,
		canvasContext,
		canvasModule;

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
			strokeColor = strokeColor || '#000000';
			fillColor = fillColor || '#000000';
			canvasContext.strokeStyle = strokeColor;
			canvasContext.fillStyle = fillColor;
			canvasContext.strokeRect(x, y, width, height);
			canvasContext.fillRect(x, y, width, height);
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

		drawAll: function (all) {
			function _subDrawAll (all) {
				var a, subA;
				for (a = 0; a < all.length; a++) {
					if (all[a].length) {
						_subDrawAll(all[a]);
					}
					else {
						all[a].draw();
					}
				}
			}

			_subDrawAll(all);
		}
	}

	return canvasModule;
});

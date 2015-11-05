if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('Canvas',
'B',
function (B) {
	var canvas,
		canvasContext;

	return {
		init: function (element) {
			canvas = document.getElementById('game-canvas');
			canvasContext = canvas.getContext('2d');

			canvas.addEventListener('mousemove', mouseMovedEvent);

			/**
			 * EVENT FOR THE MOUSE
			 */
			function mouseMovedEvent (e) {
				var rect = canvas.getBoundingClientRect(),
					root = document.documentElement;

					mouseX = e.clientX - rect.left - root.scrollLeft;
					mouseY = e.clientY- rect.top - root.scrollTop;

				B.Events.fire('mouse-moved', [mouseX, mouseY]);
			}
		},

		/**
		 * Methods to draw stuff
		 */
		drawRectangle: function (x, y, width, height, color) {
			canvasContext.fillStyle = color;
			canvasContext.fillRect(x, y, width, height);
		},

		drawCircle: function (x, y, radius, color) {
			canvasContext.fillStyle = color;
			canvasContext.beginPath();
			canvasContext.arc(x, y, radius, 0, Math.PI * 2, true);
			canvasContext.fill();
		},

		drawText: function (text, x, y, color) {
			canvasContext.fillStyle = color;
			canvasContext.fillText(text, x, y);
		},

		width: function () {
			return canvas.width;
		},

		height: function () {
			return canvas.height;
		}
	}

	return canvas;
});

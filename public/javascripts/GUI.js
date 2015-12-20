if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to providing visual elements (such as loading bar)
 */
loader.addModule('GUI',
'Canvas',
function (Canvas) {
	"use strict";

	var GUI = {
		/**
		 * Draws a progress bar.
		 * A progress bar has:
		 * - a top/left position in the canvas (x, y),
		 * - a width and height (w, y),
		 * - a progress in percents,
		 * - a border color (String),
		 * - a color for the unloaded part (String)
		 * - a color for the loaded part (String)
		 */
		progressBar: function (x, y, w, h, progress, colorBorder, colorUnloaded, colorLoaded) {
			if (progress > 1.0) {
				progress = 1.0;
			}
			Canvas.drawRectangle(
				x, y, w, h, colorUnloaded, colorBorder
			);

			if (progress > 0.000000) {
				Canvas.drawRectangle(
					x, y, w * progress, h, colorLoaded, colorLoaded
				);
			}
		}
	};

	return GUI;
});

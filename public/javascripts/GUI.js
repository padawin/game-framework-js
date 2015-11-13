if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to providing visual elements (such as buttons or loading bar)
 */
loader.addModule('GUI',
'Canvas',
function (Canvas) {
	var GUI = {
		progressBar: function (x, y, w, h, progress, colorBorder, colorUnloaded, colorLoaded) {
			if (progress > 1.0) {
				progress = 1.0;
			}
			Canvas.drawRectangle(x, y, w, h, colorUnloaded, colorBorder);

			if (progress > 0.000000) {
				Canvas.drawRectangle(x, y, w * progress, h, colorLoaded, colorLoaded);
			}
		}
	};

	return GUI;
});




if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with the game controls on the keyboard
 */
loader.addModule('Controls',
function () {
	function keyDownEvent (e) {
		console.log('Key down: ' + e.keyCode);
	}

	function keyUpEvent (e) {
		console.log('Key up: ' + e.keyCode);
	}

	var controls = {
		init: function () {
			document.addEventListener('keydown', keyDownEvent);
			document.addEventListener('keyup', keyUpEvent);
		}
	};

	return controls;
});


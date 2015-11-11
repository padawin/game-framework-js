if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with the game controls on the keyboard
 */
loader.addModule('Controls',
'B',
function (B) {
	function keyDownEvent (e) {
		console.log('Key down: ' + e.keyCode);
		B.Events.fire('keydown', [e.keyCode]);
		if (~([KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW, KEY_UP_ARROW].indexOf(e.keyCode))) {
			e.preventDefault();
		}
	}

	function keyUpEvent (e) {
		B.Events.fire('keyup', [e.keyCode]);
		if (~([KEY_DOWN_ARROW, KEY_LEFT_ARROW, KEY_RIGHT_ARROW, KEY_UP_ARROW].indexOf(e.keyCode))) {
			e.preventDefault();
		}
	}

	var controls = {
		init: function () {
			document.addEventListener('keydown', keyDownEvent);
			document.addEventListener('keyup', keyUpEvent);
		}
	};

	return controls;
});


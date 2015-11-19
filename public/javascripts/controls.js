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

	function _mouseCoordinates (e) {
		var rect = this.getBoundingClientRect(),
			root = document.documentElement;

			mouseX = e.clientX - rect.left - root.scrollLeft;
			mouseY = e.clientY- rect.top - root.scrollTop;

		return [mouseX, mouseY];
	}

	function mouseMovedEvent (e) {
		B.Events.fire('mouse-moved', _mouseCoordinates.apply(this, [e]));
	}

	function mouseClickedEvent (e) {
		B.Events.fire('mouse-clicked', _mouseCoordinates.apply(this, [e]));
	}

	var controls = {
		init: function (eventKey, eventMouseElement) {
			if (eventKey) {
				document.addEventListener('keydown', keyDownEvent);
				document.addEventListener('keyup', keyUpEvent);
			}
			if (eventMouseElement) {
				// @TODO add click and mouse down/up
				eventMouseElement.addEventListener('mousemove', mouseMovedEvent.bind(eventMouseElement));
				eventMouseElement.addEventListener('mousedown', mouseClickedEvent.bind(eventMouseElement));
			}
		}
	};

	return controls;
});


if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with the game controls on the keyboard
 */
loader.addModule('Controls',
'B',
function (B) {
	"use strict";

	function keyDownEvent (e) {
		B.Events.fire('keydown', [e.keyCode]);
		if (~([controls.KEY_DOWN_ARROW, controls.KEY_LEFT_ARROW, controls.KEY_RIGHT_ARROW, controls.KEY_UP_ARROW].indexOf(e.keyCode))) {
			e.preventDefault();
		}
	}

	function keyUpEvent (e) {
		B.Events.fire('keyup', [e.keyCode]);
		if (~([controls.KEY_DOWN_ARROW, controls.KEY_LEFT_ARROW, controls.KEY_RIGHT_ARROW, controls.KEY_UP_ARROW].indexOf(e.keyCode))) {
			e.preventDefault();
		}
	}

	function _mouseCoordinates (e) {
		var rect = this.getBoundingClientRect(),
			root = document.documentElement;

		return [
			e.clientX - rect.left - root.scrollLeft,
			e.clientY - rect.top - root.scrollTop
		];
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
				document.addEventListener('mousemove', mouseMovedEvent.bind(eventMouseElement));
				document.addEventListener('mousedown', mouseClickedEvent.bind(eventMouseElement));
			}
		},

		KEY_LEFT_ARROW: 37,
		KEY_UP_ARROW: 38,
		KEY_RIGHT_ARROW: 39,
		KEY_DOWN_ARROW: 40,

		KEY_W: 87,
		KEY_A: 65,
		KEY_S: 83,
		KEY_D: 68
	};

	return controls;
});


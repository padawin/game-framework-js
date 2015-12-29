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

	/**
	 * PRIVATE METHOD
	 *
	 * Function to execute when a keyboard key is pressed
	 * If the key is an arrow, the event must be stopped to prevent
	 * the page scroll or navigation
	 */
	function keyDownEvent (e) {
		B.Events.fire('keydown', [e.keyCode]);
		if (~([
				controls.KEY_DOWN_ARROW,
				controls.KEY_LEFT_ARROW,
				controls.KEY_RIGHT_ARROW,
				controls.KEY_UP_ARROW
			].indexOf(e.keyCode))
		) {
			e.preventDefault();
		}
	}

	/**
	 * PRIVATE METHOD
	 *
	 * Function to execute when a keyboard key is released
	 * If the key is an arrow, the event must be stopped to prevent
	 * the page scroll or navigation
	 */
	function keyUpEvent (e) {
		B.Events.fire('keyup', [e.keyCode]);
		if (~([
				controls.KEY_DOWN_ARROW,
				controls.KEY_LEFT_ARROW,
				controls.KEY_RIGHT_ARROW,
				controls.KEY_UP_ARROW
			].indexOf(e.keyCode))
		) {
			e.preventDefault();
		}
	}

	/**
	 * PRIVATE METHOD
	 *
	 * Function to calculate the coordinates of the mouse in an element
	 * according to the element's position and the cursor's position
	 */
	function _mouseCoordinates (element, event) {
		var rect = element.getBoundingClientRect(),
			root = document.documentElement;

		return [
			event.clientX - rect.left - root.scrollLeft,
			event.clientY - rect.top - root.scrollTop
		];
	}

	/**
	 * PRIVATE METHOD
	 *
	 * Function to execute when the mouse is moved
	 *
	 * fires the application event mouse-moved with the coordinates of
	 * the mouse
	 */
	function mouseMovedEvent (e) {
		B.Events.fire('mouse-moved', _mouseCoordinates(this, e));
	}

	/**
	 * PRIVATE METHOD
	 *
	 * Function to execute when the mouse is clicked
	 *
	 * fires the application event mouse-clicked with the coordinates of
	 * the mouse
	 */
	function mouseClickedEvent (e) {
		B.Events.fire('mouse-clicked', _mouseCoordinates(this, e));
	}

	/**
	 * Controls module to manage input events and transmit them in the
	 * application via Butterfly's events
	 */
	var controls = {
		init: function (eventKey, eventMouseElement) {
			if (eventKey) {
				document.addEventListener('keydown', keyDownEvent);
				document.addEventListener('keyup', keyUpEvent);
			}
			if (eventMouseElement) {
				// @TODO add click and mouse down/up
				document.addEventListener(
					'mousemove',
					mouseMovedEvent.bind(eventMouseElement)
				);
				document.addEventListener(
					'mousedown',
					mouseClickedEvent.bind(eventMouseElement)
				);
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


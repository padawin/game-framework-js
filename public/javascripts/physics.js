if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with physics calculations and collisions
 */
loader.addModule('Physics',
function () {
	var physics = {};

	/**
	 * Method to know if a sphere collides with a rectangle
	 */
	physics.sphereCollidesWithRectangle = function (sphere, rectangle) {
		return sphere.y + sphere.r > rectangle.y &&
			sphere.y - sphere.r < rectangle.y + rectangle.h &&
			sphere.x  + sphere.r > rectangle.x &&
			sphere.x - sphere.r < rectangle.x + rectangle.w;
	};

	/**
	 * site and topbot are used in case of a diagonal hit, to know where
	 * the sphere has to bounce:
	 *
	 * +---++---+
	 * | S  | R |
	 * +---++---+
	 *      +---+
	 *   O  | T |
	 *      +---+
	 *
	 * where O = sphere, R = hit rectangle, S = Side (side rectangle of
	 * the hit one) and T = topbot (top or bottom rectangle of the hit
	 * one)
	 * Side is the rectangle at the previous position X of the mouse and
	 * its current Y
	 * TopBot is the rectangle at the previous position Y of the mouse and
	 * its current X
	 *
	 * if the sphere hit a rectangle next to it, TopBot === rectangle
	 * if the sphere hit a rectangle above or bellow to it, Side === rectangle
	 * if the sphere hit a rectangle in a diagonal, The 3 will be different
	 */
	physics.sphereBounceAgainstGridRectangle = function (sphere, rectangle, rectangleSide, rectangleTopBot) {
		// hit the rectangle from top or bottom
		// hit from the side
		if (rectangle != rectangleSide && rectangle == rectangleTopBot) {
			sphere.speedX *= -1;
		}
		// hit from above or below
		else if (rectangle == rectangleSide && rectangle != rectangleTopBot) {
			sphere.speedY *= -1;
		}
		// hit on a corner
		else if (rectangle != rectangleSide && rectangle != rectangleTopBot) {
			if (!(rectangleSide !== undefined && rectangleTopBot === undefined)) {
				sphere.speedX *= -1;
			}
			if (!(rectangleSide === undefined && rectangleTopBot !== undefined)) {
				sphere.speedY *= -1;
			}
		}
	};

	/**
	 * Make a moving sphere bouncing against a rectangle
	 *
	 * @TODO this might be too game-related
	 */
	physics.sphereBounceAgainstRectangle = function (sphere, rectangle) {
		// to change with actual physics
		sphere.speedY *= -1;

		var centerPaddleX = rectangle.x + rectangle.w / 2,
			distFromPaddleCenter = sphere.x - centerPaddleX;

		sphere.speedX = distFromPaddleCenter * 0.35;
	};

	return physics;
});


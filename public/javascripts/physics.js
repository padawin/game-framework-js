if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('Physics',
function () {
	var physics = {};

	physics.sphereCollidesWithRectangle = function (sphere, rectangle) {
		return sphere.y + BALL_RADIUS > rectangle.y &&
			sphere.y - BALL_RADIUS < rectangle.y + rectangle.h &&
			sphere.x  + BALL_RADIUS > rectangle.x &&
			sphere.x - BALL_RADIUS < rectangle.x + rectangle.w;
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
			if (!(rectangleSide && rectangleSide.state === BRICK_STATE_ACTIVE && rectangleTopBot && rectangleTopBot.state === BRICK_STATE_INACTIVE)) {
				sphere.speedX *= -1;
			}
			if (!(rectangleSide && rectangleSide.state === BRICK_STATE_INACTIVE && rectangleTopBot && rectangleTopBot.state === BRICK_STATE_ACTIVE)) {
				sphere.speedY *= -1;
			}
		}
	};

	/**
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


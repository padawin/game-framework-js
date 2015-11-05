if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.addModule('Physics',
function () {
	var physics = {},
		objects = {};

	physics.addObject = function (objectId, object) {
		objects[objectId] = object;
	};

	physics.sphereCollidesWithRectangle = function (sphereId, rectId) {
		var sphere = objects[sphereId],
			rectangle = objects[rectId];

		return sphere.y + BALL_RADIUS > rectangle.y &&
			sphere.y - BALL_RADIUS < rectangle.y + rectangle.h &&
			sphere.x  + BALL_RADIUS > rectangle.x &&
			sphere.x - BALL_RADIUS < rectangle.x + rectangle.w;
	};

	physics.sphereBounceAgainstGridRectangle = function (sphere, rectangle) {
		// hit the rectangle from top or bottom
		if (sphere.oldGridCellRow != sphere.gridCellRow) {
			sphere.speedY *= -1;
		}
		// hit the rectangle from side
		if (sphere.oldGridCellCol != sphere.gridCellCol) {
			sphere.speedX *= -1;
		}
	};

	physics.sphereBounceAgainstRectangle = function (sphere, rectangle) {
		// to change with actual physics
		sphere.speedY *= -1;

		var centerPaddleX = rectangle.x + rectangle.w / 2,
			distFromPaddleCenter = sphere.x - centerPaddleX;

		sphere.speedX = distFromPaddleCenter * 0.35;
	};

	return physics;
});


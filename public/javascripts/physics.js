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

	physics.sphereCollidesWithRect = function (sphereId, rectId) {
		var sphere = objects[sphereId],
			rectangle = objects[rectId];

		return sphere.y + BALL_RADIUS > rectangle.y &&
			sphere.y - BALL_RADIUS < rectangle.y + rectangle.h &&
			sphere.x  + BALL_RADIUS > rectangle.x &&
			sphere.x - BALL_RADIUS < rectangle.x + rectangle.w;
	};

	physics.sphereBounceAgainstStaticRectangle = function (sphere, rectangle) {
		sphere.speedY *= -1;
	};

	physics.sphereBounceAgainstRectangle = function (sphere, rectangle) {
		physics.sphereBounceAgainstStaticRectangle(sphere, rectangle);

		var centerPaddleX = rectangle.x + rectangle.w / 2,
			distFromPaddleCenter = sphere.x - centerPaddleX;

		sphere.speedX = distFromPaddleCenter * 0.35;
	};

	return physics;
});


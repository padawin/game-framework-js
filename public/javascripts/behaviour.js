if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to apply specific behaviours to an object
 */
loader.addModule('Behaviour',
'Canvas',
function (canvas) {
	"use strict";

	var behaviour,
		_behaviours;

	behaviour = {
		setBehaviours: function (obj, behaviours) {
			if (!obj.behaviours) {
				obj.behaviours = {};
			}

			behaviours.forEach(function (behaviour) {
				obj.behaviours[behaviour] = {};
			});
		},

		animated: {
			setAnimation: function (obj, animation) {
				var b = obj.behaviours.animated;
				b._animation = animation;
				b._frame = 0;
				b._tick = 0;
				b._timePerFrame = obj.graphic.animations[animation].timePerFrame;
				b._frames = obj.graphic.animations[animation].frames;
				b._framesNb = b._frames.length;
			},

			updateFrame: function (obj) {
				var b = obj.behaviours.animated;
				b._tick++;
				if (b._tick == b._timePerFrame) {
					b._tick = 0;
					b._frame = (b._frame + 1) % b._framesNb;
				}
			},

			draw: function (obj, x, y) {
				var b = obj.behaviours.animated;
				canvas.drawImage(
					obj.graphic.resource,
					x,
					y,
					b._frames[b._frame]
				);
			}
		}
	}

	return behaviour;
});

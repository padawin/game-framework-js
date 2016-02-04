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
		}
	}

	return behaviour;
});

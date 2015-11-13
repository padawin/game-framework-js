if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module providing game data
 */
loader.addModule('data',
function () {
	var data = {
		maps: [
			{width: 20, height: 8, map:
			[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			 [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
			 [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
			 [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
			 [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
			 [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
			 [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
			 [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0]]}
		]
	};

	return data;
});

if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module to deal with physics calculations and collisions
 */
loader.addModule('data',
function () {
	var data = {
		maps: [
			{width: 20, height: 15, map:
			[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
			 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
			 [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1],
			 [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			 [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,1],
			 [1,0,2,1,0,0,1,1,1,1,1,1,1,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,1,1,1,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1],
			 [1,0,0,1,1,1,1,0,0,1,0,0,0,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,0,0,1,1,1,1,0,0,1,1],
			 [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1],
			 [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,1],
			 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]],
			 CELL_WALL: 1}
		],
		resourcesMap: {TILE_ROAD: 0, TILE_GRASS: 1, TILE_START: 2, CAR: 3},
		resources: [
			{url: 'images/road.png'},
			{url: 'images/grass.png'},
			{url: 'images/start.png'},
			{url: 'images/player1car.png'}
		]
	};

	return data;
});




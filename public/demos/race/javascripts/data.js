if (typeof (require) != 'undefined') {
	var loader = require('../../../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module providing game data
 */
loader.addModule('data',
function () {
	var data = {
		maps: [
			{width: 20, height: 15, start: [[2, 7], [1, 7]], map:
			[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
			 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
			 [1,0,0,5,1,1,1,1,1,1,1,1,1,1,1,1,0,0,2,1],
			 [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,1],
			 [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,2,1],
			 [1,3,3,1,0,0,1,1,1,1,1,1,1,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,2,2,1,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,1,1,1,0,0,1,1,0,0,1],
			 [1,0,0,1,1,1,5,0,0,1,0,0,0,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,0,0,1,0,0,5,1,1,1,0,0,2,1],
			 [1,0,0,0,0,0,2,2,1,1,0,0,0,0,0,0,0,0,2,1],
			 [1,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,2,1],
			 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]}
		],
		resourcesMap: {TILE_ROAD: 0, TILE_WALL: 1, TILE_GRASS: 2, TILE_FINISH: 3, CAR: 4, TILE_FLAG: 5},
		resources: [
			{url: 'images/road.png', obstacle: false},
			{url: 'images/wall.png', obstacle: true},
			{url: 'images/grass.png', obstacle: false},
			{url: 'images/start.png', obstacle: false},
			{url: 'images/player1car.png'},
			{url: 'images/flag.png', obstacle: true}
		]
	};

	return data;
});

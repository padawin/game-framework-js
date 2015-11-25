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
			{width: 16, height: 12, start: [2, 7], map:
			[[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
			 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
			 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
			 [1,0,0,1,1,1,1,1,1,1,1,1,0,0,2,1],
			 [1,0,0,1,0,0,0,0,0,0,0,1,0,0,2,1],
			 [1,3,3,1,0,0,1,1,1,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,1,1,0,0,1,0,0,0,1],
			 [1,0,0,1,1,0,0,1,0,0,0,1,0,0,0,1],
			 [1,0,0,1,0,0,0,1,0,0,1,1,0,0,2,1],
			 [1,0,0,0,0,0,2,2,0,0,0,0,0,0,2,1],
			 [1,0,0,0,0,0,1,1,0,0,0,0,0,0,2,1],
			 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]]}
		],
		resourcesMap: {TILE_ROAD: 0, TILE_WALL: 1, TILE_GRASS: 2, TILE_DOOR: 3, WARRIOR: 4},
		resources: [
			{url: 'images/road.png', obstacle: false, texture: true},
			{url: 'images/wall.png', obstacle: true, texture: true},
			{url: 'images/grass.png', obstacle: false, texture: true},
			{url: 'images/door.png', obstacle: true, texture: false, background: 0}, // 0 is a road
			{url: 'images/player1warrior.png'}
		]
	};

	return data;
});

if (typeof (require) != 'undefined') {
	var loader = require(__dirname + '/../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

loader.executeModule('entitiesTest', 'Entities', 'Tests', function (Entities, Tests) {
	Tests.addSuite('entities', [
		/**
		 * Test if the methods exist
		 */
		function () {
			Tests.isA(Entities.Ball, 'function');
			Tests.isA(Entities.Brick, 'function');
			Tests.isA(Entities.Paddle, 'function');
		}
	]);
});

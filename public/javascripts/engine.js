if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Engine module, deal with the whole game linking, the screens, display
 * of a loading bar...
 */
loader.addModule('Engine',
'Canvas',
function (canvas) {
	var _callbacks = {},
		engine = {};

	function _addCallback (name, callback) {
		_callbacks[name] = callback;
	}

	engine.addLevelFinishedCallback = function (callback) {
		_addCallback('levelFinished', callback);
	};

	engine.addGameFinishedCallback = function (callback) {
		_addCallback('gameFinished', callback);
	};

	engine.addUpdateAllCallback = function (callback) {
		_addCallback('updateAll', callback);
	};

	engine.addDrawAllCallback = function (callback) {
		_addCallback('drawAll', callback);
	};

	engine.loadResources = function (resources, loadedCallback) {
		var r, loaded = 0,
			loadingPadding = canvas.width() / 5,
			loadingWidth = 3 * loadingPadding;

		if (!resources) {
			loadedCallback();
			return;
		}

		canvas.clearScreen();
		GUI.progressBar(
			loadingPadding, canvas.height() / 2,
			loadingWidth, 30,
			0,
			'black', 'white', 'black'
		);
		for (r = 0; r < resources.length; r++) {
			resources[r].resource = new Image();
			resources[r].resource.onload = function () {
				if (++loaded == resources.length) {
					loadedCallback();
				}
				else {
					GUI.progressBar(
						loadingPadding, canvas.height() / 2,
						loadingWidth, 30,
						loaded / resources.length,
						'black', 'white', 'black'
					);
				}
			};
			resources[r].resource.src = resources[r].url;
		}
	};

	return engine;
});


if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Engine module, deal with the whole game linking, the screens, display
 * of a loading bar...
 */
loader.addModule('Engine',
'Canvas', 'Level', 'data',
function (canvas, Level, data) {
	var _callbacks = {},
		engine = {},
		level;

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

	function _runCallback (name) {
		if (typeof _callbacks[name] == 'function') {
			_callbacks[name]();
		}
	}

	function _resetLevel (newLevel, currentLevelIndex) {
		if (newLevel) {
			level = Level.createLevel(data, currentLevelIndex);
		}
		else {
			level.reset();
		}

		_runCallback('resetLevel');
	}

	engine.addCallback = function (name, callback) {
		_callbacks[name] = callback;
	};

	engine.getLevel = function () {
		return level;
	};

	engine.resetLevel = _resetLevel;

	return engine;
});


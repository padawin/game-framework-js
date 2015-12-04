if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Engine module, deal with the whole game linking, the screens, display
 * of a loading bar...
 */
loader.addModule('Engine',
'B', 'Canvas', 'Controls', 'Level', 'data', 'GUI',
function (B, canvas, Controls, Level, data, GUI) {
	"use strict";

	var _callbacks = {},
		engine = {},
		fps = 30,
		currentLevelIndex = 0,
		// some states
		gameFinished = false,
		levelFinished = false,
		_drawables = [],
		level,
		// If set to true, the camera will scroll, otherwise, the
		// level will have to fit in the camera
		_fixedSizeWorld;

	engine.OPTION_USE_KEYBOARD = 0x1;
	engine.OPTION_USE_MOUSE = 0x2;
	engine.OPTION_FIXED_SIZE_WORLD = 0x4;

	function _loadResources (loadedCallback) {
		var r, loaded = 0,
			loadingPadding = canvas.width() / 5,
			loadingWidth = 3 * loadingPadding,
			resources = data.resources,
			_resourceLoaded;

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

		_resourceLoaded = function () {
			loaded++;
			GUI.progressBar(
				loadingPadding, canvas.height() / 2,
				loadingWidth, 30,
				loaded / resources.length,
				'black', 'white', 'black'
			);

			if (loaded == resources.length) {
				loadedCallback();
			}
		};

		for (r = 0; r < resources.length; r++) {
			if (resources[r] && resources[r].url) {
				resources[r].resource = new Image();
				resources[r].resource.onload = _resourceLoaded;
				resources[r].resource.src = resources[r].url;
			}
			else {
				if (resources[r]) {
					resources[r].resource = resources[r].color;
				}
				++loaded;
			}
		}

		if (loaded == resources.length) {
			loadedCallback();
		}
	}

	/**
	 * Method to execute on each frame to update the game state and the
	 * objects's position and then redraw the canvas
	 */
	function _updateAll () {
		if (!gameFinished && !levelFinished) {
			_runCallback('moveAll');
		}

		canvas.clearScreen('black');
		if (gameFinished) {
			_runCallback('gameFinishedScreen');
		}
		else if (levelFinished) {
			_runCallback('levelFinishedScreen');
		}
		else {
			canvas.drawAll([level.cells, _drawables]);
		}
	}

	function _runCallback (name, args) {
		if (typeof _callbacks[name] == 'function') {
			_callbacks[name].apply(this, args);
		}
	}

	function _resetLevel (newLevel) {
		if (newLevel) {
			level = Level.createLevel(data, currentLevelIndex);
		}
		else {
			level.reset();
		}

		_runCallback('resetLevel');
	}

	function _initEvents () {
		// Event to execute when the player wins
		B.Events.on('win', null, function () {
			if (currentLevelIndex == data.maps.length - 1) {
				_resetLevel(true);
				gameFinished = true;
			}
			else {
				_resetLevel(false);
				levelFinished = true;
			}

			_runCallback('win', arguments);
		});

		// Event to execute when the player loses
		B.Events.on('lost', null, function () {
			_resetLevel(false);

			_runCallback('lose');
		});

		// Event to execute when the mouse is clicked
		B.Events.on('mouse-clicked', null, function () {
			if (levelFinished) {
				currentLevelIndex++;
				_resetLevel(true);
				levelFinished = false;
			}
			else if (gameFinished) {
				currentLevelIndex = 0;
				_resetLevel(true);
				gameFinished = false;
			}

			_runCallback('mouseClicked');
		});

		// Event to execute when the mouse move
		B.Events.on('mouse-moved', null, function (mX, mY) {
			_runCallback('mouseMoved', [mX, mY]);
		});
	}

	engine.addCallback = function (name, callback) {
		_callbacks[name] = callback;
	};

	engine.init = function (canvasElement, options, callback) {
		_fixedSizeWorld = (options & engine.OPTION_FIXED_SIZE_WORLD) == engine.OPTION_FIXED_SIZE_WORLD;
		B.on(window, 'load', function () {
			// Init the view
			canvas.init(canvasElement);
			Controls.init(
				(options & engine.OPTION_USE_KEYBOARD) == engine.OPTION_USE_KEYBOARD,
				(options & engine.OPTION_USE_MOUSE) == engine.OPTION_USE_MOUSE ? canvasElement : null
			);

			_loadResources(function () {
				_resetLevel(true);

				if (typeof callback == 'function') {
					callback();
				}
				setInterval(_updateAll, 1000 / fps);
			});
		});

		_initEvents();
	};

	engine.addDrawable = function (drawable) {
		_drawables.push(drawable);
	};

	engine.getLevel = function () {
		return level;
	};

	engine.resetLevel = _resetLevel;
	engine._loadResources = _loadResources;
	engine.updateAll = _updateAll;
	engine.levelFinished = levelFinished;
	engine.gameFinished = gameFinished;

	return engine;
});


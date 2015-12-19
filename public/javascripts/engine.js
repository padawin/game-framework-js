if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Engine module, deal with the whole game linking, the screens, display
 * of a loading bar...
 */
loader.addModule('Engine',
'B', 'Canvas', 'Controls', 'Level', 'data', 'GUI', 'Camera',
function (B, canvas, Controls, Level, data, GUI, Camera) {
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
		_fixedSizeWorld,
		_camera;

	engine.NO_DEBUG = 0;

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
			canvas.drawAll(
				_getCameraCoordinatesInWorld(level),
				[level.cells, _drawables, _camera]
			);
		}
	}

	function _getCameraCoordinatesInWorld (level) {
		var x, y,
			worldWidth = level.gridCellWidth * level.width,
			worldHeight = level.gridCellHeight * level.height;

		// If the world width fits in the camera
		if (_camera.w >= worldWidth) {
			x = (worldWidth - _camera.w) / 2;
		}
		// else if the world is wider than the camera
		// place the camera where it is supposed to be, bounded by the
		// world's limits
		else {
			x = Math.max(
				0,
				Math.min(
					_camera.xWorld - _camera.w / 2,
					worldWidth - _camera.w
				)
			);
		}

		// If the world height fits in the camera
		if (_camera.h >= worldHeight) {
			y = (worldHeight - _camera.h) / 2;
		}
		// else if the world is taller than the camera
		// place the camera where it is supposed to be, bounded by the
		// world's limits
		else {
			y = Math.max(
				0,
				Math.min(
					_camera.yWorld - _camera.h / 2,
					worldHeight - _camera.h
				)
			);
		}

		return {x: x, y: y};
	}

	function _runCallback (name, args) {
		if (typeof _callbacks[name] == 'function') {
			_callbacks[name].apply(this, args);
		}
	}

	function _resetLevel (newLevel) {
		if (newLevel) {
			level = Level.createLevel(
				data,
				currentLevelIndex,
				_getGridCellDimensions()
			);
		}
		else {
			level.reset();
		}

		_runCallback('resetLevel');
	}

	/**
	 * Return the dimensions of a gridcell depending on if the level has
	 * a fix size or not
	 */
	function _getGridCellDimensions () {
		var cellDimensions;
		if (!_fixedSizeWorld) {
			cellDimensions = [
				canvas.width() / data.maps[currentLevelIndex].width,
				canvas.height() / data.maps[currentLevelIndex].height
			];
		}
		else if (data.maps[currentLevelIndex].cellWidth && data.maps[currentLevelIndex].cellHeight) {
			cellDimensions = [
				data.maps[currentLevelIndex].cellWidth,
				data.maps[currentLevelIndex].cellHeight
			];
		}
		else {
			throw "The dimensions of the grid's cells are needed in the map definition";
		}

		return cellDimensions;
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

	engine.initCamera = function (xWorld, yWorld, x, y, w, h) {
		_camera = new Camera(xWorld, yWorld, x, y, w, h);
	};

	engine.updateCameraPosition = function (x, y) {
		_camera.xWorld = x;
		_camera.yWorld = y;
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

					if (!_camera) {
						engine.initCamera(
							canvas.width() / 2,
							canvas.height() / 2,
							0, 0,
							canvas.width(), canvas.height()
						);
					}
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

	return engine;
});


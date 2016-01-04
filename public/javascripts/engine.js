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

	/**
	 * PRIVATE METHOD
	 *
	 * Method to load the resources provided in data to be used in the
	 * game. Once all the resources are loaded, loadedCallback is
	 * executed.
	 */
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
	 * PRIVATE METHOD
	 *
	 * Method to execute on each frame to update the game state with the
	 * moveAll event.
	 *
	 * During the move allEvent, if the win event is fired, gameFinished
	 * or levelFinished will be switched to true. If one of those is
	 * true, the corresponding event (gameFinishedScreen or
	 * levelFinishedScreen) will be fired to display the correct screen.
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
			_drawAll([level.cells, _drawables]);
		}
	}

	/**
	 * Draw a list of elements
	 * Every element's coordinate is relative to the world, so
	 * the startPosition argument is supposed to be an object with
	 * the coordinates of where to start to draw the elements in the
	 * world to convert the world coordinates into camera
	 * coordinates
	 */
	function _drawAll (all) {
		function _subDrawAll (all) {
			var a, visible;
			for (a = 0; a < all.length; a++) {
				if (all[a].length) {
					_subDrawAll(all[a]);
				}
				else {
					// [all[a].x, all[a].y] are the position of the
					// element in the world
					var x = all[a].x - _camera.xWorld,
						y = all[a].y - _camera.yWorld;
					// [x, y] are the position of the element in the
					// canvas

					visible = true;
					if (x + all[a].w < _camera.x || x > _camera.x + _camera.w) {
						visible = false;
					}
					else if (y + all[a].h < _camera.y || y > _camera.y + _camera.h) {
						visible = false;
					}

					if (visible) {
						all[a].draw(x, y);
					}
				}
			}
		}

		_subDrawAll(all);
		_camera.draw();
	}

	/**
	 * PRIVATE METHOD
	 *
	 * Callbacks can be hooked in the engine from the application to be
	 * executed at specific times (eg. display a end of level/game
	 * screen).
	 * This method runs a callback from its name with given arguments.
	 */
	function _runCallback (name, args) {
		if (typeof _callbacks[name] == 'function') {
			_callbacks[name].apply(this, args);
		}
	}

	/**
	 * PRIVATE METHOD
	 *
	 * This method resets the current level. If the argument newLevel is
	 * set to true, the level is reconstructed.
	 */
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
	 * PRIVATE METHOD
	 *
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

	/**
	 * PRIVATE METHOD
	 *
	 * Inits different events in the engine, from Butterfly.Events
	 */
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

	/**
	 * Method to add a callback to the engine, to be executed in the
	 * appropriate time.
	 */
	engine.addCallback = function (name, callback) {
		_callbacks[name] = callback;
	};

	/**
	 * Initialise the camera in a given position in the world and with
	 * given dimensions and positions in the screen.
	 */
	engine.initCamera = function (xWorld, yWorld, x, y, w, h) {
		_camera = new Camera(xWorld, yWorld, x, y, w, h);
	};

	/**
	 * Moves the camera to the given position in the world
	 * The camera will be bounded by the world's limits. If the camera is too
	 * close to the wall, it will be blocked to not display the
	 * "outside" of the level. However, if the level is smaller than the
	 * camera, the level will be centered (vertically and/or
	 * horizontally) in the camera.
	 */
	engine.updateCameraPosition = function (xWorld, yWorld) {
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
					xWorld - _camera.w / 2,
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
					yWorld - _camera.h / 2,
					worldHeight - _camera.h
				)
			);
		}

		_camera.xWorld = x - _camera.x;
		_camera.yWorld = y - _camera.y;
	};

	/**
	 * This method is the engine's entry point. It takes in arguments a
	 * canvas element, some options (in an integer value) and a
	 * callback.
	 * The options can be:
	 * 	Engine.OPTION_USE_KEYBOARD: To monitor the key strokes
	 * 	Engine.OPTION_USE_MOUSE: To monitor the mouse movements and
	 * 		clicks
	 * 	Engine.OPTION_FIXED_SIZE_WORLD: If provided, The world has a
	 * 		fixed size and does not have to fit in the camera. If the
	 * 		option is not provided, the level will be stretched to fit
	 * 		in the camera dimensions.
	 *
	 * The method initialises the canvas, the controls and loads the
	 * resources provided in the data module. Once the resources are
	 * loaded, the callback is then executed.
	 */
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
							0, 0,
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

	/**
	 * This method is called to add a drawable element in the engine.
	 * All the added drawable elements are displayed on each frame.
	 */
	engine.addDrawable = function (drawable) {
		_drawables.push(drawable);
	};

	/**
	 * Returns the game's current level.
	 */
	engine.getLevel = function () {
		return level;
	};

	return engine;
});


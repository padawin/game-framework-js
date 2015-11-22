if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Engine module, deal with the whole game linking, the screens, display
 * of a loading bar...
 */
loader.addModule('Engine',
'B', 'Canvas', 'Controls', 'Level', 'data',
function (B, canvas, Controls, Level, data) {
	var _callbacks = {},
		engine = {},
		fps = 30,
		currentLevelIndex = 0,
		// some states
		gameFinished = false,
		levelFinished = false,
		_drawables = [],
		level;

	function _loadResources (loadedCallback) {
		var r, loaded = 0,
			loadingPadding = canvas.width() / 5,
			loadingWidth = 3 * loadingPadding,
			resources = data.resources;

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
	}

	/**
	 * Method to execute on each frame to update the game state and the
	 * objects's position and then redraw the canvas
	 */
	function _updateAll () {
		canvas.clearScreen('black');
		if (gameFinished) {
			_runCallback('gameFinishedScreen');
		}
		else if (levelFinished) {
			_runCallback('levelFinishedScreen');
		}
		else {
			_runCallback('moveAll');
			canvas.drawAll([_drawables, level.cells]);
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

	engine.addCallback = function (name, callback) {
		_callbacks[name] = callback;
	};

	engine.init = function (canvasElement, callback) {
		B.on(window, 'load', function () {
			// Init the view
			canvas.init(canvasElement);
			Controls.init(false, canvasElement);

			_loadResources(function () {
				_resetLevel(true);

				if (typeof callback == 'function') {
					callback();
				}
				setInterval(_updateAll, 1000 / fps);
			});
		});
	};

	engine.initEvents = function () {
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

			_runCallback('win');
		});

		// Event to execute when the player loses
		B.Events.on('lost', null, function () {
			_resetLevel(false);

			_runCallback('lose');
		});

		// Event to execute when the mouse is clicked
		B.Events.on('mouse-clicked', null, function (mX, mY) {
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
			mouseX = mX;
			mouseY = mY;

			_runCallback('mouseMoved', [mouseX, mouseY]);
		});
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


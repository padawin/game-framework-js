(function () {
	var canvas = document.getElementById('game-canvas'),
		canvasContext = canvas.getContext('2d'),
		fps = 30;

	setInterval(updateAll, 1000 / fps);

	function updateAll () {
		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(0, 0, canvas.width, canvas.height);
		canvasContext.fillStyle = 'white';
		canvasContext.beginPath();
		canvasContext.arc(100, 100, 10, 0, Math.PI * 2, true);
		canvasContext.fill();
	}
})();

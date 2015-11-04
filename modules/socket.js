module.exports = function (io) {
	// When a socket is connecting, define different events
	io.sockets.on('connection', function (socket) {
		// emit a message to the emiting socket
		socket.emit('connection-confirmation', { message: 'socket connected' });

		// when receiving a message, broadcast it to everybody
		socket.on('send-message', function (data) {
			data.from = socket.id;
			io.sockets.emit('message', data);
		});
	});
};

if (typeof (require) != 'undefined') {
	var loader = require('./loader.js').loader;
}

loader.executeModule('main',
'B',
function (B) {
	var host,
		socket;

	function messageReceived (data) {
		console.log('Message received');
		console.log(data);
	}

	function sendMessage (text) {
		socket.emit('send-message', { message: text });
	}

	function confirmationConnectionSocket (data) {
		console.log(data);
		console.log('Sent message: Some message');
		sendMessage('Some message');
	}

	host = window.location.protocol.concat('//')
		.concat(window.location.hostname)
		.concat(':').concat(window.location.port);
	var socket = io.connect(host);
	socket.on('connection-confirmation', confirmationConnectionSocket);
	socket.on('message', messageReceived);
});

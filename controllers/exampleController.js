module.exports = function (io) {
	var controller = {
		get: function (req, res) {
			res.setHeader('content-type', 'application/json');

			res.json(['OK']);
		}
	};
	return controller;
};

var express = require('express'),
	router = express.Router();

module.exports = function (controller) {
	router.get('/:id', controller.get);

	return router;
};

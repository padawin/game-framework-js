if (typeof (require) != 'undefined') {
	var loader = require('../../node_modules/Butterfly-js/dist/butterfly.min.js').loader;
}

/**
 * Module with different util functions
 */
loader.addModule('Utils',
function () {
	"use strict";

	return {
		/**
		 * Method to get the get parameters of the current url as an
		 * object
		 */
		getUrlParams: function (urlQueryString) {
			var query = urlQueryString.substring(1).split("&"),
				i,
				param,
				params = {};
			for (i = 0; i < query.length; i++) {
				param = query[i].split('=');
				params[param[0]] = param[1];
			}
			return params;
		}
	};
});

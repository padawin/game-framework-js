/* global require, process */
var tests = require(__dirname + '/../node_modules/Butterfly-js/src/js/tests.js').Tests;
require(__dirname + '/../node_modules/Butterfly-js/dist/butterfly.min.js');
require(__dirname + '/../public/javascripts/globals.js');
require(__dirname + '/../public/javascripts/canvas.js');
require(__dirname + '/../public/javascripts/entities.js');
require(__dirname + '/public/entities.js');

process.exit(tests.runTests(console.log));

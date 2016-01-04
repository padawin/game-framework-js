var compressor = require('yuicompressor');
var fs = require('fs');
var path = require('path');


var files = ['public/javascripts/utils.js', 'public/javascripts/physics.js', 'public/javascripts/canvas.js', 'public/javascripts/camera.js', 'public/javascripts/GUI.js', 'public/javascripts/controls.js', 'public/javascripts/entities.js', 'public/javascripts/level.js', 'public/javascripts/engine.js'];
var file = 'dist/game-framework.min.js';
var dir = './dist';

function minify (f) {
	if (f == files.length) {
		return;
	}

	fs.createReadStream(files[f]).pipe(fs.createWriteStream(dir + '/' + path.basename(files[f])));

	compressor.compress(files[f], {
		//Compressor Options:
		charset: 'utf8',
		type: 'js',
		'preserve-semi': false
	}, function(err, data, extra) {
		console.log('Compressing ' + files[f]);
		console.log(extra);
		if (!err) {
			fs.appendFile(file, data, function (err) {
				if (err)
					return console.error(err);
				minify(++f);
			});
		}
		else {
			console.error(err);
		}
	});
}

if (!fs.existsSync(dir)){
	fs.mkdirSync(dir);
}
fs.exists(file, function(exists) {
	if (exists) {
		fs.unlink(file);
	}

	var curr = 0;

	console.log('Creation of ' + file);
	fs.writeFile(file, '', function (err) {
		if (err)
			return console.error(err);
		minify(0);
	});
});

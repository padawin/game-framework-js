var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
	secret: '-[gx>j@nl41tL=eL3*C0{<On3t)xN-1_>5wvSgDxkbnRO9B;7Fa&}.qp<Nt_xjA/&D4{"vTJ~[@hUqta_oj/NlrcEbrw1jCJq[',
	resave: true,
	saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/lib', express.static(__dirname + '/node_modules/Butterfly-js/dist'));

// init socket
require('./modules/socket.js')(io);

// controllers
var exampleController = require('./controllers/exampleController.js')(io);
// end controllers

// routes
var exampleRoutes = require('./routes/example')(exampleController);

app.use('/api/example', exampleRoutes);
// end routes

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

var server = http.listen(3000, function () {
	var host = server.address().address,
		port = server.address().port;

  console.log('Server listening at http://%s:%s', host, port);
});

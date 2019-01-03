var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require ('cors');
var passport = require ('passport');
var config = require ('./config/database');
var mongoose = require ('mongoose');

// connect to database
mongoose.connect(config.database);

// On connection
mongoose.connection.on('connected', function() {
console.log ('Connected to database ' +config.database);
});

//On error
mongoose.connection.on('error', function(err){
console.log ('Database error' +err);
});

var app = express();


var users = require('./routes/users');
//port number
var port = 8080;

//CORS middleware
app.use(cors());

//Set Static Folder
//app.use(express.static(path.join(__dirname, 'public')));



//Body parser Middleware

//app.use(bodyParser.urlencoded());

//app.use(bodyParser.json());
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

//Index route
app.get('/', function(req,res){
	res.send('Invalid Endpoint');
});

//Start Server
app.listen(port, () =>{
console.log('Server started on ' +port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

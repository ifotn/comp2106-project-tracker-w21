var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexController = require('./controllers/index');
var usersController = require('./controllers/users');
var projectsController = require('./controllers/projects') // add reference to new controller
var coursesController = require('./controllers/courses')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexController);
app.use('/users', usersController);
app.use('/projects', projectsController)
app.use('/courses', coursesController)

// mongodb connection
const mongoose = require('mongoose')

// global vars configuration file
const config = require('./config/globals')

mongoose.connect(config.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
    .then((res) => {
      console.log('Connected to MongoDB')
    }).catch(() => {
      console.log('MongoDB Connection Failed')
})

// hbs helper function to pre-select correct dropdown option
const hbs = require('hbs')

hbs.registerHelper('createOption', (currentValue, selectedValue) => {
    // if values match add 'selected' to this option tag
    var selectedProperty = ''
    if (currentValue == selectedValue) {
        selectedProperty = ' selected'
    }

    return new hbs.SafeString('<option' + selectedProperty + '>' + currentValue + '</option>')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

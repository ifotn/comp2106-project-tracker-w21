var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexController = require('./controllers/index');
var usersController = require('./controllers/users');
var projectsController = require('./controllers/projects') // add reference to new controller
var coursesController = require('./controllers/courses')

// passport libraries for auth
const passport = require('passport')
const session = require('express-session')
const gitHubStrategy = require('passport-github2').Strategy

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// configure sessions & passport BEFORE mapping the controllers. Required for controllers to use passport
app.use(session({
    secret: 'w21Pr@jectTr2cker!',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

// global vars configuration file
const config = require('./config/globals')

// link passport to our model that extends passport-local-mongoose
const User = require('./models/user')
passport.use(User.createStrategy())

// configure passport-github2 auth w/API keys and our User model
passport.use(new gitHubStrategy({
    clientID: config.github.clientId,
    clientSecret: config.github.clientSecret,
    callbackURL: config.github.callbackUrl
},
    // after successful GitHub login, register or login user
    async (accessToken, refreshToken, profile, done) => {
        // does github user already exist in our db?
        const user = await User.findOne({ oauthId: profile.id })

        if (user) {
            return done(null, user)
        }
        else {
            const newUser = new User({
                username: profile.username,
                oauthId: profile.id,
                oauthProvider: 'GitHub',
                created: Date.now()
            })

            const savedUser = await newUser.save()
            done(null, savedUser)
        }
    }))

// set passport so it read / write user data to / from session object
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use('/', indexController);
app.use('/users', usersController);
app.use('/projects', projectsController)
app.use('/courses', coursesController)

// mongodb connection
const mongoose = require('mongoose')

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

    console.log(currentValue + '/' + selectedValue)
    return new hbs.SafeString('<option' + selectedProperty + '>' + currentValue + '</option>')
})

hbs.registerHelper('shortDate', (dateVal) => {
    return new hbs.SafeString(dateVal.toLocaleDateString('en-US'))
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

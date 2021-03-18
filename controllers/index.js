// use express dependency and its Routing feature to parse url's
var express = require('express');
var router = express.Router();

// User model & passport for auth
const User = require('../models/user')
const passport = require('passport')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project Tracker' });
});

/* GET /about */
router.get('/about', (req, res, next) => {
  res.render('about', {
    title: 'About this Site',
    pageText: 'Here is some dynamic info from the controller'
  })
})

/* GET /register */
router.get('/register', (req, res, next) => {
  res.render('register', { title: 'Please create an account' })
})

/* POST /register */
router.post('/register', (req, res, next) => {
  // invoke User model which extends passport-local-mongoose to create a new user in the db
  // password gets passed as separate param for hashing
  User.register(new User( {
    username: req.body.username
  }), req.body.password, (err, newUser) => {
    if (err) {
      return res.redirect('/register')
    }
    else {
      // login the user in automatically & go to projects list
      req.login(newUser, (err) => {
        res.redirect('/projects')
      })
    }
  })
})

/* GET /login */
router.get('/login', (req, res, next) => {
  // check for login error messages in the session object and display them if any
  let messages = req.session.messages || [];
  req.session.messages = []; // clear out any session messages

  res.render('login', {
    title: 'Please enter your credentials',
    messages: messages // pass any error messages to the view for display
  })
})

/* POST /login */ // use passport to authenticate the login attempt
router.post('/login', passport.authenticate('local', {
  successRedirect: '/projects',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login' // this gets stored in session var
}))

/* GET /logout */ // sign user out
router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/login')
})

// make the controller public
module.exports = router;

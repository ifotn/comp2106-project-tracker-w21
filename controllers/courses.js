// require express and enable express routing
const express = require('express')
const router = express.Router()

// add course model for CRUD operations
const Course = require('../models/course')

// passport for auth
const passport = require('passport')

// auth check for access control to create/edit/delete methods
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { // user is already authenticated
        return next() // do the next thing in the request i.e. continue with the calling function
    }

    res.redirect('/login') // anonymous user tried to access a private method => go to login
}

/* GET /courses/add */
router.get('/add', isLoggedIn, (req, res, next) => {
    res.render('courses/add', {
        title: 'Add a Course',
        user: req.user
    })
})

/* POST /courses/add */
router.post('/add', isLoggedIn, (req, res, next) => {
    Course.create({
        courseCode: req.body.courseCode
    }, (err, newProject) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/')
        }
    })
})

// make public
module.exports = router;

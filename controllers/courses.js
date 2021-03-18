// require express and enable express routing
const express = require('express')
const router = express.Router()

// add course model for CRUD operations
const Course = require('../models/course')

// passport for auth
const passport = require('passport')

/* GET /courses/add */
router.get('/add', (req, res, next) => {
    res.render('courses/add', {
        title: 'Add a Course',
        user: req.user
    })
})

/* POST /courses/add */
router.post('/add', (req, res, next) => {
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

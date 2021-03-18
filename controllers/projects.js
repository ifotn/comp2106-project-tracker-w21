// require express and enable express routing
const express = require('express')
const router = express.Router()

// add project model for CRUD operations
const Project = require('../models/project')
const Course = require('../models/course')

// add passport for auth checking
const passport = require('passport')

// auth check for access control to create/edit/delete methods
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) { // user is already authenticated
        return next() // do the next thing in the request i.e. continue with the calling function
    }

    res.redirect('/login') // anonymous user tried to access a private method => go to login
}

/* GET /projects */
router.get('/', (req, res, next) => {
    // use Project model to fetch all projects for display
    Project.find((err, projects) => {
        if (err) {
            console.log(err)
        }
        else {
            // load the index view, set the title, and pass the query resultset as "projects"
            // now pass the current user (if any) to show in navbar
            res.render('projects/index', {
                title: 'My Projects',
                projects: projects,
                user: req.user
            })
        }
    })
})

/* GET /projects/add - now made private using isLoggedIn function 3/18 */
router.get('/add', isLoggedIn, (req, res, next) => {
    // use Course model to fetch list of courses for dropdown
    Course.find((err, courses) => {
        if (err) {
            console.log(err)
        }
        else {
            res.render('projects/add', {
                title: 'Project Details',
                courses: courses,
                user: req.user
            })
        }
    }).sort({ courseCode: 1 })
})

/* POST /projects/add */
router.post('/add', isLoggedIn, (req, res, next) => {
    // use the Project model to save the form data to MongoDB
    Project.create({
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course
    }, (err, newProject) => {
        if (err) {
            console.log(err)
        }
        else {
            // if successful, redirect to projects index
            res.redirect('/projects')
        }
    })
})

/* GET /projects/delete/abc123 */
router.get('/delete/:_id', isLoggedIn, (req, res, next) => {
    // use the Project model to delete the selected document
    Project.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/projects')
        }
    })
})

/* GET /projects/edit/abc123 */
router.get('/edit/:_id', isLoggedIn, (req, res, next) => {
    Project.findById(req.params._id, (err, project) => {
        if (err) {
            console.log(err)
        }
        else {
            // get courses for dropdown
            Course.find((err, courses) => {
                if (err) {
                    console.log(err)
                }
                else {
                    res.render('projects/edit', {
                        title: 'Project Details',
                        project: project,
                        courses: courses,
                        user: req.user
                    })
                }
            }).sort({ courseCode: 1} )
        }
    })
})

/* POST /projects/edit/abc123 */
router.post('/edit/:_id', isLoggedIn, (req, res, next) => {
    Project.findOneAndUpdate({ _id: req.params._id }, {
        name: req.body.name,
        dueDate: req.body.dueDate,
        course: req.body.course,
        status: req.body.status
    }, (err, project) => {
        if (err) {
            console.log(err)
        }
        else {
            res.redirect('/projects')
        }
    })
})

// make public
module.exports = router;

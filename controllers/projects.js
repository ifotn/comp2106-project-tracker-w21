// require express and enable express routing
const express = require('express')
const router = express.Router()

// add project model for CRUD operations
const Project = require('../models/project')
const Course = require('../models/course')

/* GET /projects */
router.get('/', (req, res, next) => {
    // use Project model to fetch all projects for display
    Project.find((err, projects) => {
        if (err) {
            console.log(err)
        }
        else {
            // load the index view, set the title, and pass the query resultset as "projects"
            res.render('projects/index', {
                title: 'My Projects',
                projects: projects
            })
        }
    })
})

/* GET /projects/add */
router.get('/add', (req, res, next) => {
    // use Course model to fetch list of courses for dropdown
    Course.find((err, courses) => {
        if (err) {
            console.log(err)
        }
        else {
            res.render('projects/add', {
                title: 'Project Details',
                courses: courses
            })
        }
    }).sort({ courseCode: 1 })
})

/* POST /projects/add */
router.post('/add', (req, res, next) => {
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
router.get('/delete/:_id', (req, res, next) => {
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

// make public
module.exports = router;

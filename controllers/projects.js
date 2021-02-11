// require express and enable express routing
const express = require('express')
const router = express.Router()

/* GET /projects */
router.get('/', (req, res, next) => {
    res.render('projects/index', { title: 'My Projects' })
})

// make public
module.exports = router;

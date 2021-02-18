// reference mongoose
const mongoose = require('mongoose')

// define project schema
var projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date
    },
    course: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'To-Do'
    }
})

// export the schema so it's public - visible to the controller
module.exports = mongoose.model('Project', projectSchema)

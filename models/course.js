const mongoose = require('mongoose')

// Define project schema
const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true
    }
})

// Export schema so it is publicly visible to the controller
module.exports = mongoose.model('Course', courseSchema)

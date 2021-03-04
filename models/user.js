const mongoose = require('mongoose')

// add new ref to passport-local-mongoose: special Model to manage user auth
const plm = require('passport-local-mongoose')

// create schema
var userSchema = new mongoose.Schema({
    username: String,
    password: String
})

// use passport-local-mongoose to indicate this is a special auth model
userSchema.plugin(plm)

// make public by exporting
module.exports = mongoose.model('User', userSchema)

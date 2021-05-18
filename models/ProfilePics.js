const mongoose = require('mongoose')

const profilePic = new mongoose.Schema({
    name:{
        type: String,
        max: 255
    },
    photo:{
        data: Buffer,
        contentType: String,
    }
})

module.exports = mongoose.model("ProfilePic",profilePic);
const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique: true,
        min: 2,
        max:255
    },
    email:{
        type: String,
        required:true,
        min: 6
    },
    password:{
        type: String,
        required:true,
        min: 2,
        max: 1024
    },
    photo:{
        data: Buffer,
        contentType: String,
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User",userSchema)
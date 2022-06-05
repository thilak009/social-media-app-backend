const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({
    fullname:{
        type: String,
        max: 255
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
    bio:{
        type: String,
        max: 200
    },
    followers:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "User"}
    ],
    following:[
        {type: mongoose.Schema.Types.ObjectId,
        ref: "User"}
    ],
    role:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("User",userSchema)
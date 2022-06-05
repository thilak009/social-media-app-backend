const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tag: {
        type: String,
        required:true  
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    upvotes:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: "User"}
    ],
    downvotes:[
        {type: mongoose.Schema.Types.ObjectId,
            ref: "User"}
    ]
},{timestamps: true})

module.exports = mongoose.model("Post",postSchema)
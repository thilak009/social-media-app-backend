const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    upvotes:{
        type: Number,
        default: 0,
    },
    downvotes:{
        type: Number,
        default: 0,
    }
},{timestamps: true})

module.exports = mongoose.model("Post",postSchema)
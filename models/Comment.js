const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        unique: true
    },
    users:[{
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        comment:{
            type: String,
            required: true
        },
        date:{
            type: Date,
            default: Date.now()
        }
    }]
},{timestamps: true})

module.exports = mongoose.model('Comments',commentSchema)
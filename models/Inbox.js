const mongoose = require('mongoose')


const chatSchema = new mongoose.Schema({
    members:{
        type: Array
    },
    lastMessage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
},{timestamps: true})

const messageSchema = new mongoose.Schema({
    message:{
        type: String,
        required: true
    },
    chatId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    },
    author_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps: true})

const Chat = mongoose.model("Chat",chatSchema)
const Message = mongoose.model("Message",messageSchema)

module.exports = {Chat, Message}
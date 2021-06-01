const mongoose = require('mongoose')

const inboxSchema = new mongoose.Schema({
    chats:[{
        otherUserId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        chatId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat"
        }
    }]
},{timestamps: true})

const chatSchema = new mongoose.Schema({
    members:{
        type: Array
    },
    // messages:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Message"
    // }],
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

const Inbox = mongoose.model("Inbox",inboxSchema)
const Chat = mongoose.model("Chat",chatSchema)
const Message = mongoose.model("Message",messageSchema)

module.exports = {Inbox, Chat, Message}
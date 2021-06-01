const {Inbox, Chat,Message} = require('../models/Inbox')
const User = require('../models/User')
const { initializeSocket } = require('../socket')

exports.checkChatRoom=async(req,res)=>{
    const userId = req.params.userId
    const otherUserId = req.params.otherUserId

    
    const chatPresent = await Chat.findOne({members: {$all: [userId,otherUserId]}},'_id')
    if(!chatPresent){
        const newChat = new Chat({
            members: [userId,otherUserId]
        })
        try {
            const savedChat = await newChat.save()
            return res.status(200).json(savedChat)
        } catch (error) {
            return res.status(500).json(error)
        }
    }
    return res.status(200).json(chatPresent)
}
exports.getAllMessages=async(req,res)=>{
    const chatId = req.params.chatId

    

    const messages = await Message.find({chatId: chatId})
    return res.status(200).json(messages)
}
exports.sendMessage=async(req,res)=>{

    const userId = req.params.userId
    const chatId = req.params.chatId
    const {message} = req.body
    
    const newMessage = new Message({
        message: message,
        chatId: chatId,
        author_id: userId
    })
    const savedMessage = await newMessage.save()
    return res.status(200).json(savedMessage)
}
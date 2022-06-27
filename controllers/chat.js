const {Chat,Message} = require('../models/Inbox')
const User = require('../models/User')
const { initializeSocket } = require('../socket')

exports.checkChatRoom = async (req, res) => {
    console.log("check chat room")
    console.log(req.params);
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
exports.getAllMessages = async (req, res) => {
    console.log("in get all messages")
    const chatId = req.params.chatId

    const messages = await Message.find({chatId: chatId})
    return res.status(200).json(messages)
}
exports.sendMessage=async(req,res)=>{

    console.log("in send message")
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

exports.getChatInbox = async (req, res) => {
    console.log("in controller")
    const userId = req.params.userId
    const chat = await Chat.find({ members: { "$in": [userId] } })
    let mappedArr = await chat.map(async _ => {
        let message = await Message.find({ chatId: _.id }).populate('author_id', 'fullname -_id')
        let chatName = _.members.find(member => member != userId)
        let messageResult = message[message.length - 1]
        var messageResponse = {
            "message_id": messageResult.id,
            "last_message": messageResult.message,
            "chat_id": messageResult.chatId,
            "last_message_sender": messageResult.author_id.fullname,
            "other_user_details": await User.findById(chatName, 'fullname photo')
        }
        return messageResponse
    })
    res.status(200).send(await Promise.all(mappedArr))

}
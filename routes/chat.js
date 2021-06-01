const router = require('express').Router({ mergeParams: true })
const { isSignedin } = require('./verifyToken')

const {sendMessage, checkChatRoom, getAllMessages} = require('../controllers/chat')
const { initializeSocket } = require('../socket')


router.get('/:otherUserId',isSignedin,checkChatRoom)
router.get('/:chatId/get-messages',isSignedin,getAllMessages)

router.post('/:chatId/send',isSignedin,sendMessage)


module.exports = router
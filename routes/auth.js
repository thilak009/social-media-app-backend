const router=require('express').Router()
const {signin,uploadFile } = require('../controllers/auth')
const multer = require('multer')
const {isSignedin} =require('./verifyToken')

const upload = multer({
    storage:multer.memoryStorage()
})
//LOGIN
router.post('/login', signin)

//UploadFile
router.post('/upload',upload.single('file'),uploadFile)

module.exports=router;
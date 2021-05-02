const router=require('express').Router()


const {signup,signin} = require('../controllers/auth')

router.post('/register',signup)
//LOGIN
router.post('/login',signin)

module.exports=router;
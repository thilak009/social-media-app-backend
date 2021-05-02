const router = require('express').Router({ mergeParams: true })
const { isSignedin } = require('./verifyToken')

const {editProfile, getUserById, photo} = require('../controllers/profile')


router.put('/edit-profile',isSignedin,editProfile)

router.get('/photo',getUserById,photo)

module.exports = router
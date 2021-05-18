const router = require('express').Router({ mergeParams: true })
const { isSignedin } = require('./verifyToken')

const {editProfile, getCurrentUserById,setFollow, checkFollow, removeFollow} = require('../controllers/profile')
const {getUserPhoto, uploadPhotoToCatalog, selectProfilePic} = require('../controllers/imageHelper')

//edit profile routes
router.put('/edit-profile',isSignedin,editProfile)
router.put('/edit-profile-pic',isSignedin,selectProfilePic)

router.put('/follow/:userProfileId',isSignedin,setFollow)
router.put('/unfollow/:userProfileId',isSignedin,removeFollow)

router.get('/follow/:userProfileId',isSignedin,checkFollow)
//getting user profile photo
router.get('/photo',getCurrentUserById,getUserPhoto)

//uploading profile photos to choose by admin
router.post('/upload-photo-to-catalog',isSignedin,getCurrentUserById,uploadPhotoToCatalog)


module.exports = router
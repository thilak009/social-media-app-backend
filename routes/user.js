const router=require('express').Router({ mergeParams: true })
const {isSignedin} =require('./verifyToken')


const { createComment, getComments, getUserProfile} = require('../controllers/user')
const {createPost, getAllPosts,getUserPosts, deletePost, getPostById} = require('../controllers/posts')

router.param('postId',getPostById)

//ROUTES
router.get('/',isSignedin,getAllPosts)
router.get('/profile/:userProfileId',getUserProfile)
router.get('/profile/:userProfileId/posts',getUserPosts)
router.get('/:postId/get-comments',isSignedin,getComments)

router.post('/create-post',isSignedin,createPost)
router.post('/:postId/comment',isSignedin,createComment)

router.delete('/delete-post/:postId',isSignedin,deletePost)


module.exports=router;
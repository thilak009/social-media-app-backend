const router=require('express').Router({ mergeParams: true })
const {isSignedin} =require('./verifyToken')


const {createPost, getAllPosts, deletePost, getPostById, createComment, getComments} = require('../controllers/user')

router.param('postId',getPostById)

//ROUTES
router.get('/',isSignedin,getAllPosts)

router.post('/create-post',isSignedin,createPost)

router.delete('/delete-post/:postId',isSignedin,deletePost)

router.post('/:postId/comment',isSignedin,createComment)

router.get('/:postId/get-comments',isSignedin,getComments)

module.exports=router;
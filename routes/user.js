const router=require('express').Router({ mergeParams: true })
const {isSignedin} =require('./verifyToken')


const { createComment, getComments, getUserProfile} = require('../controllers/user')
const {createPost, getAllPosts,getUserPosts, deletePost, getPostById, upvoteAPost,removeUpvote, downvoteAPost, removeDownvote, getVoteDetails, getPost} = require('../controllers/posts')

router.param('postId',getPostById)

//ROUTES
router.get('/',isSignedin,getAllPosts)
router.get('/profile/:userProfileId',isSignedin,getUserProfile)
router.get('/profile/:userProfileId/posts',isSignedin,getUserPosts)
router.get('/:postId/get-comments',isSignedin,getComments)
router.get('/:postId/get-votes',isSignedin,getVoteDetails)
router.get('/:postId',isSignedin,getPost)

router.post('/create-post',isSignedin,createPost)
router.post('/:postId/comment',isSignedin,createComment)
router.put('/:postId/upvote',isSignedin,upvoteAPost)
router.put('/:postId/remove-upvote',isSignedin,removeUpvote)
router.put('/:postId/downvote',isSignedin,downvoteAPost)
router.put('/:postId/remove-downvote',isSignedin,removeDownvote)

router.delete('/delete-post/:postId',isSignedin,deletePost)


module.exports=router;
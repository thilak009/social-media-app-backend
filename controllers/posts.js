const Post = require('../models/Posts')
const Comment = require('../models/Comment')
//const User = require('../models/User')

exports.createPost = async(req,res)=>{

    const {title,description}  = req.body
    const userId = req.params.userId
    
    const post = new Post({
        postedBy: userId,
        title: title,
        description: description
    })
    if(userId && title && description){
        try {
            const savedPost = await post.save()

            const comment = new Comment({
                postId: savedPost._id
            })
            const savedComment = await comment.save()
        
            return res.status(200).json(savedPost)
            
        } catch (error) {
            return res.json({
                error: error
            })
        }
    }
    else{
        return res.status(400).json({
            error: "please fill all details"
        })
    }
}

exports.getPostById=(req,res,next)=>{

    const postId = req.params.postId

    Post.findById(postId).exec((err,post)=>{
        if(err){
            return res.status(500).json({
                error: "cannot find post try again"
            })
        }
        req.post = post
        next()
    })
}

exports.getAllPosts = async(req,res)=>{
    
    const posts = await Post.find().populate('postedBy','-email -password -photo')
    .sort({createdAt: "desc"})

    return res.status(200).json(posts)
}

exports.getUserPosts=async(req,res)=>{

    const userId = req.params.userProfileId
    
    const posts = await Post.find({postedBy: userId}).populate('postedBy','-email -password -photo')
    .sort({createdAt: "desc"})

    return res.status(200).json(posts)
}

exports.deletePost = (req,res)=>{

    const userId = req.params.userId

    try {
        
        const post = req.post

        if(post.postedBy._id == userId){
            
            post.remove((err,post)=>{
                if(err){
                    return res.status(400).json({
                        error: "failed to delete the post"
                    })
                }
                else{
                    Comment.findOneAndRemove({postId: post._id}).exec((err,comments)=>{
                        if(err){
                            return res.status(400).json({
                                error: "failed to delete the comments"
                            })
                        }
                    });
                    return res.status(200).json({
                        deletedpost: post
                    })
                }
            })
        }
        else{
            return res.status(400).json({
                error: "you cannot delete this post"
            })
        }
    } 
    catch (error) {
        return res.status(500).json({
            error: error
        })
    }
}
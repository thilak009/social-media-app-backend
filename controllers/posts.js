const Post = require('../models/Posts')
const Comment = require('../models/Comment')
const User= require('../models/User')

exports.createPost = async(req,res)=>{

    const {title,description,tag}  = req.body
    const userId = req.params.userId
    
    const post = new Post({
        postedBy: userId,
        title: title,
        description: description,
        tag:tag
    })
    
    if(userId && title && description && tag){
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
exports.getPost = (req,res)=>{

    const postId = req.params.postId
    Post.findById(postId).populate('postedBy','-email -password -photo -followers -following')
    .exec((err,post)=>{
        if(err){
            return res.status(500).json({
                error: "cannot find post try again"
            })
        }
        return res.json(post)
    })
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

exports.getAllPosts = async (req,res)=>{
    
    const userId = req.params.userId
    const lastId = req.header('lastId')
    try {
        const userRole = await User.findOne({ _id: userId }, 'role -_id')
        console.log(userRole);
        if (!lastId) {
            console.log("in if")
            var tagValue;
            if (userRole.role == 'Student') {
                tagValue='Students'
            }
            else if (userRole.role == 'Faculty') {
                tagValue='Faculty'
            }

            Post.find(
                {
                    $or:[
                        { tag: { "$in": [tagValue, 'All'] } },
                        { postedBy: { "$in": [userId] } }
                    ]
                },'-upvotes -downvotes')
                .populate('postedBy', '-email -password -photo -followers -following -bio')
                .limit(10)
                .sort({createdAt: "desc"}).exec((err,posts)=>{
                    if (err) {
                        console.log(err)
                        return res.status(400).json({
                            message: err
                        })
                    }
                    return res.status(200).json(posts)
                })
           
        }
        else {
            console.log("in else")
            Post.find({'_id':{'$lt':lastId}},'-upvotes -downvotes').populate('postedBy','-email -password -photo -followers -following -bio')
            .limit(0)
            .sort({createdAt: "desc"}).exec((err,posts)=>{
                if (err) {
                    console.log(err)
                    return res.status(400).json({
                        message: err
                    })
                }
                return res.status(200).json(posts)
            })
        }
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
}

exports.getUserPosts=(req,res)=>{

    const userId = req.params.userId
    const userProfileId = req.params.userProfileId
    
    Post.find({postedBy: userProfileId},'-upvotes -downvotes').populate('postedBy','-email -password -photo -followers -following')
    .sort({createdAt: "desc"}).exec((err,posts)=>{
        if(err){
            return res.json({
                message: "unable to fetch posts"
            })
        }
        return res.status(200).json(posts)
    })
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

exports.getVoteDetails=(req,res)=>{

    const userId = req.params.userId
    const postId = req.params.postId
    try {
        Post.findById({_id: postId}).exec((err,post)=>{
            if(err || !post){
                return res.json({
                    message: "unable to fetch post votes details"
                })
            }
            const {upvotes,downvotes} = post
            const requiredPostDetails = {
                upvoteCount: upvotes.length,
                downvoteCount: downvotes.length,
                upvoted: upvotes.includes(userId),
                downvoted: downvotes.includes(userId)
            }
            return res.json(requiredPostDetails)
        })        
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

exports.upvoteAPost=async(req,res)=>{

    const userId = req.params.userId
    const postId = req.params.postId
    const downvoted = req.body.downvoted

    try {
        if(downvoted){
            await Post.findByIdAndUpdate({_id: postId},{$pull:{downvotes: userId},$addToSet:{upvotes: userId}})
        }
        else{
            await Post.findByIdAndUpdate({_id: postId},{$addToSet:{upvotes: userId}})
        }
        return res.json({
            messaage: "upvoted"
        })    
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

exports.removeUpvote=async(req,res)=>{

    const userId = req.params.userId
    const postId = req.params.postId
    try {
        await Post.findByIdAndUpdate({_id: postId},{$pull:{upvotes: userId}})  
        return res.json({
            messaage: "removed upvote"
        })    
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

exports.downvoteAPost=async(req,res)=>{
    const userId = req.params.userId
    const postId = req.params.postId
    const upvoted = req.body.upvoted

    try {
        if(upvoted){
            await Post.findByIdAndUpdate({_id: postId},{$pull:{upvotes: userId},$addToSet:{downvotes: userId}})
        }
        else{
            await Post.findByIdAndUpdate({_id: postId},{$addToSet:{downvotes: userId}})
        }
        return res.json({
            messaage: "downvoted"
        })    
    } catch (error) {
        return res.json({
            error: error
        })
    }
}

exports.removeDownvote=async(req,res)=>{
    const userId = req.params.userId
    const postId = req.params.postId
    try {
        await Post.findByIdAndUpdate({_id: postId},{$pull:{downvotes: userId}})  
        return res.json({
            messaage: "downvote removed"
        })    
    } catch (error) {
        return res.json({
            error: error
        })
    }
}
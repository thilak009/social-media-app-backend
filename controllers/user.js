const Post = require('../models/Posts')
const Comment = require('../models/Comment')
const User = require('../models/User')


exports.getUserProfile=(req,res)=>{
    const userId = req.params.userProfileId

    User.findOne({_id: userId},'-email -password -photo -following -followers').exec((err,user)=>{
        if(err){
            return res.status(400).json({
                error: "user not found"
            })
        }
        return res.status(200).json(user);
    })
}

exports.createComment = (req,res)=>{

    const {comment} = req.body
    const postId = req.params.postId
    const userId = req.params.userId
    try{
        Comment.findOne({postId: postId})
        .updateOne({
            $push: {users: {
                userId: userId,
                comment: comment
            }}
        })
        .exec((err,comment)=>{
            if(err){
                return res.status(500).json({
                    error: "cannot find the post" 
                })
            }
            else{
                return res.json({
                    message: "successfully commented"
                })
            }
        })
    }
    catch(error){
        return res.json({
            error: error
        })
    }
}

exports.getComments = (req,res)=>{

    const postId = req.params.postId
    
    //TODO: only load like 10-20 comments
    try {
        Comment.findOne({postId: postId}).populate('users.userId','username fullname').exec((err,comments)=>{
            if(err){
                return res.status(400).json({
                    error: "unable to find the post"
                })
            }
            else{
                // comments.users.sort((a, b) => b.date - a.date);
                comments.users.reverse();
                return res.status(200).json(comments.users)
            }
        })
    } catch (error) {
        return res.status(400).json({
            error: error
        })
    }
} 

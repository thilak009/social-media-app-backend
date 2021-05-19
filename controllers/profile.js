const User = require('../models/User')
//const ProfilePic = require('../models/ProfilePics')
const formidable = require('formidable')
const fs = require('fs')

exports.getCurrentUserById = (req,res,next)=>{

    User.findById(req.params.userId)
    .exec((err,user)=>{
        if(err){
            return res.status(400).json({
                error: "user not found"
            })
        }
        req.user = user;
        next()
    })
}

exports.editProfile = async (req,res)=>{

    const userId = req.params.userId;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,async(err,fields,file)=>{
        
        if(err){
            return res.status(400).json({
                error: "problem with image"
            })
        }
        const {fullname,bio} = fields;
        
        if(file.photo){
            let photo ={
                data: fs.readFileSync(file.photo.path),
                contentType: file.photo.path
            }
            if(file.photo.size > 1000000){
                return res.status(400).json({
                    error: "file size too big"
                })
            }
            await User.findOneAndUpdate({_id: userId},{photo: photo,fullname: fullname,bio: bio});
        }
        else{
            if(fullname && bio){
                await User.findOneAndUpdate({_id: userId},{fullname: fullname,bio: bio});
            }
            else if(fullname){
                await User.findOneAndUpdate({_id: userId},{fullname: fullname});
            }
            else if(bio){
                await User.findOneAndUpdate({_id: userId},{bio: bio});
            }
        }
        
        return res.json({
            message: "user updated"
        })
    })
}

exports.checkFollow=(req,res)=>{

    const userProfileId = req.params.userProfileId
    const userId = req.params.userId

    User.findById({_id: userId},'following').exec(async(err,user)=>{
        if(err){
            return res.json({
                error: err
            })
        }
        const follow = user.following.includes(userProfileId);
        const userFollowersData = await User.findById({_id: userProfileId},'followers following');
        return res.json({
            follow: follow,
            followers: userFollowersData.followers.length,
            following: userFollowersData.following.length
        })
    })
}

exports.setFollow = async(req,res)=>{
    
    const userProfileId = req.params.userProfileId
    const userId = req.params.userId

    try {
        await User.findByIdAndUpdate({_id: userId},{$addToSet:{following: userProfileId}})
        await User.findByIdAndUpdate({_id: userProfileId},{$addToSet:{followers: userId}})  
    } catch (error) {
        return res.json(error)
    }
    return res.json({
        message: "following"
    })
    
}

exports.removeFollow=async(req,res)=>{

    const userProfileId = req.params.userProfileId
    const userId = req.params.userId

    try {
        await User.findByIdAndUpdate({_id: userId},{$pull:{following: userProfileId}})
        await User.findByIdAndUpdate({_id: userProfileId},{$pull:{followers:userId}})
        return res.json({
            message: "unfollowed"
        })
    } catch (error) {
        return res.json(error)
    }
}


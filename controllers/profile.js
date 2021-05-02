const User = require('../models/User')
const formidable = require('formidable')
const fs = require('fs')

exports.getUserById = (req,res,next)=>{

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
        //console.log(file);
        // let user = new User(fields);
        let photo ={
            data: fs.readFileSync(file.photo.path),
            contentType: file.photo.path
        }
        //console.log(photo);
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "file size too big"
                })
            }
        }

        let result = await User.findOneAndUpdate({_id: userId},{photo: photo});
        return res.json(result)
    })
}

exports.photo = (req,res,next)=>{
    
    if(req.user.photo.data){
        res.set("Content-Type",req.user.photo.contentType);
        return res.send(req.user.photo.data)
    }
    next();
}
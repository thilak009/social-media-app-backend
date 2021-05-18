const User = require('../models/User')
const bcrypt =require('bcryptjs')
const ProfilePic = require('../models/ProfilePics')
const jwt = require('jsonwebtoken')

exports.signup=async(req,res)=>{
    
    //check if email already exists
    const emailExists = await User.findOne({email:req.body.email});
    if(emailExists){
        return res.status(400).json({
            error:"email already exists"
        })
    }
    const userNameExists = await User.findOne({username:req.body.username})
    if(userNameExists){
        return res.status(400).json({
            error: "username already exists"
        })
    }
    //Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password,10); 
    
    //getting a default profile pic
    const defaultPicture = await ProfilePic.findOne({name: "billy"});

    //Creating the user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        photo: defaultPicture.photo
    })

    try{
        const savedUser = await user.save()
        
        return res.json({
            id: savedUser._id
        })
    }
    catch(error){
        res.status(400).json(error)
    }
}

exports.signin= async (req,res)=>{

    //check if email already exists
    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).json({
            error: "email or password is wrong"
        })
    }
    //check if password is correct
    const validPasword = await bcrypt.compare(req.body.password, user.password)
    if(!validPasword){
        return res.status(400).json({
            error: "email or password is wrong"
        })
    }
    //creating a token
    const token = jwt.sign({_id:user._id},process.env.SECRET)
    // res.header("auth-token",token)
    // res.send(token)
    const {_id,username} = user;
    res.json({
        token: token,
        user:{_id,username}
    })
}
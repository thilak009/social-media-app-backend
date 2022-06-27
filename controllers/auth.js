const User = require('../models/User')
const bcrypt =require('bcryptjs')
const ProfilePic = require('../models/ProfilePics')
const jwt = require('jsonwebtoken')
const readXlsxFile = require('read-excel-file/node')
const { Readable } = require('stream')
const nodeMailer = require('nodemailer')

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

exports.uploadFile = async (req, res) => {
    try {
        const file_buffer = req.file['buffer']
        const file_stream = bufferToStream(file_buffer)
        
        console.log(file_stream)
        readXlsxFile(file_stream).then(
            async (rows) => {
                var obj = convertToJSON(rows)
                var response = {
                    "success": [],
                    "failure":[]
                };
                console.log(obj)
                for (user of obj) {
                    let result = await signup(user)
                    if(result.status)
                        response.success.push(result.message)
                    else
                        response.failure.push(result.message)
                }
                console.log(response)
                res.status(200).send(response)
            }
        ).catch((err) => {
            res.status(400).send({
                message:err.message
            })
        })
    }catch(err) {
        res.status(400).send({
            message:err.message
        })
    }
}

signup = async(user) => {
    
    //check if email already exists
    const emailExists = await User.findOne({email:user.email});
    if (emailExists) {
        return {
            "message": user.email + " already exists",
            "status":false
        } 
    }
    //Hash the password
    const password = generatePwd()
    console.log(password)
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    console.log("email"+user.email)
    console.log(hashedPassword)
    //getting a default profile pic
    const defaultPicture = await ProfilePic.findOne({name: "billy"});

    //Creating the user
    const userModel = new User({
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        password: hashedPassword,
        photo: defaultPicture.photo
    })

    try{
        const savedUser = await userModel.save()
        
        if (savedUser._id) {
            sendEmail(user,password)
            return {
            "message": user.email + " created successfully",
            "status":true
        } 
        }
        else {
            return {
            "message": user.email + " error while creating",
            "status":false
        }
        }
    }
    catch (err) {
        return {
            "message": user.email+" error while creating"+err.message,
            "status":false
        }
    }

}

bufferToStream = (buffer) => {
    return Readable.from(buffer)
}

convertToJSON = (array) => {
  var first = array[0].join()
  var headers = first.split(',');

  var jsonData = [];
  for ( var i = 1, length = array.length; i < length; i++ )
  {

    var myRow = array[i].join();
    var row = myRow.split(',');

    var data = {};
    for ( var x = 0; x < row.length; x++ )
    {
      data[headers[x]] = row[x];
    }
    jsonData.push(data);

  }
  return jsonData;
}

generatePwd = () => {
    var pass = '';
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + 
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';
        
    for (let i = 1; i <= 8; i++) {
        var char = Math.floor(Math.random()
                    * str.length + 1);
            
        pass += str.charAt(char)
    }
        
    return pass;
}

sendEmail = (user,password) => {
    const emailBody = "User created for email: " + user.email + "\n" + "The password: " + password;
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS
        },

    });

    let mailOptions = {
        from: process.env.USER_PASS,
        to: user.email,
        subject: "Quora for college Credentials",
        text: emailBody
    };

    transporter.sendMail(mailOptions,(err, info)=> {
        if(err)
            return console.log(err);
        console.log('Email sent to:' + user.email);
    })
}
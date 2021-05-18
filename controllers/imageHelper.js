const ProfilePic = require('../models/ProfilePics')

exports.getImageCatalog= async(req,res)=>{

    try{
        const catalog = await ProfilePic.find({},{name:1,_id:0});
        return res.status(200).json(catalog);
        // ProfilePic.find().exec((err,catalog)=>{
        //     if(err){
        //         return res.json({
        //             error: "cannot find images"
        //         })
        //     }
        //     else{
        //         return res.status(200).json(catalog)
        //     }
        // });   
    }
    catch(error){
        return res.status(401).json({
            error: error
        })
    }
}

exports.getAImageFromCatalog=async(req,res)=>{
    
    const name = req.params.photoName;

    const requiredImage = await ProfilePic.findOne({name: name});

    if(requiredImage){
        res.set("Content-Type",requiredImage.photo.contentType);
        return res.send(requiredImage.photo.data)
    }
}
//i guess i don't need this anymore i used this in
//Profile.js in frontend but i changed to UserProfile.js
//so yeah might remove it
exports.getUserPhoto = (req,res,next)=>{
    
    if(req.user.photo.data){
        res.set("Content-Type",req.user.photo.contentType);
        return res.send(req.user.photo.data)
    }
    next();
}

exports.uploadPhotoToCatalog = (req,res)=>{
    
    const userId = req.params.userId;
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    if(req.user.role == 1){
        form.parse(req,async(err,fields,file)=>{
            if(err){
                return res.status(400).json({
                    error: "problem with image"
                })
            }
            
            let photo ={
                data: fs.readFileSync(file.photo.path),
                contentType: file.photo.path
            }
            
            if(file.photo){
                if(file.photo.size > 3000000){
                    return res.status(400).json({
                        error: "file size too big"
                    })
                }
            }
            const newPhoto = new ProfilePic({
                name: fields.name,
                photo: photo
            })
            let result = await newPhoto.save();
            return res.json(result)
        })
    }
    else{
        return res.status(400).json({
            error: "you can't upload photo"
        })
    }
}

exports.selectProfilePic=(req,res)=>{

    const {name} = req.body;
    const userId = req.params.userId;

    try {

        ProfilePic.findOne({name: name}).exec(async(err,selectedPic)=>{
            if(err){
                return res.status(500).json({
                    error: "cannot find the selected image"
                })
            }
            else{
                await User.findOneAndUpdate({_id: userId},{photo: selectedPic.photo})
                return res.status(200).json({
                    message: "profile pic updated"
                })
            }
        }) 

    } catch (error) {
        return res.json({
            error: error
        })
    }
}
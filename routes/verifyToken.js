const jwt = require('jsonwebtoken')


const isSignedin = (req,res,next)=>{

    const token = req.header('auth-token')
    const userId = req.params.userId;  

    if(!token){
        return res.status(401).send('access denied')
    }
    try {
        const verified = jwt.verify(token,process.env.SECRET)
        
        if(userId === verified._id){
            req.user = verified;
        }
        else{
                return res.status(400).json({
                error: "invalid token"
            })
        }
    } catch (error) {
        res.status(400).send("invalid token")
    }
    next()
}

module.exports ={isSignedin}
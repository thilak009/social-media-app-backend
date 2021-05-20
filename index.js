const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const port = process.env.PORT || 5500
mongoose.set('useFindAndModify', false);
//database connection
mongoose.connect(process.env.DB_CONNECT,
{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology:true
}
,()=>console.log('DB connected'))



//importing routes
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const profileRoutes = require('./routes/profile')
const helperRoutes = require('./routes/helper')

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("hello")
})
app.use('/api/helper',helperRoutes)
app.use('/api/user',authRoutes)
app.use('/api/user/:userId',userRoutes)
app.use('/api/user/profile/:userId',profileRoutes)

app.listen(port,()=>console.log('server on 5500'))

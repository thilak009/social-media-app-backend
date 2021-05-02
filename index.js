const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

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

app.use(express.json())
app.use(cors())

app.use('/api/user',authRoutes)
app.use('/api/user/:userId',userRoutes)
app.use('/api/user/profile/:userId',profileRoutes)

app.listen(5500,()=>console.log('server on 5500'))

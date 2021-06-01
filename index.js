const express=require('express')
const app=express()
const mongoose=require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
// const http= require('http')
// const server = http.createServer(app)
// const {Server} =require('socket.io')
// const io = new Server(server,{
//     cors:{
//         origin: 'http://localhost:3000',
//         methods: ["GET","POST"]
//     }
// })

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


app.use(express.json())
app.use(cors())

//importing routes
const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/user')
const profileRoutes = require('./routes/profile')
const helperRoutes = require('./routes/helper')
const chatRoutes = require('./routes/chat')


app.get('/',(req,res)=>{
    res.send("hello")
})
app.use('/api/helper',helperRoutes)
app.use('/api/user',authRoutes)
app.use('/api/user/:userId',userRoutes)
app.use('/api/user/profile/:userId',profileRoutes)
app.use('/api/user/chat/:userId',chatRoutes)

// io.on('connection',(socket)=>{
//     socket.on('connect chat',chatId=>{
//         socket.join(chatId)
//     })
//     socket.on('new message',(messageData)=>{
//         const {message,chatId,userId} = messageData
//         const ownerUserId = userId
//         io.to(chatId).emit('new message',{message,ownerUserId});
//     })
//     socket.on('is typing',(data)=>{
//         const {username,chatId} = data
//         socket.to(chatId).emit('is typing',username)
//     })
// })


// server.listen(port,()=>console.log(`server on ${port}`))

app.listen(port,()=>console.log(`server on ${port}`))
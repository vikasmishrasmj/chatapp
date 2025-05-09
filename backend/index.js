import express from 'express'
import dotenv from 'dotenv'
import dbConnect from './db/dbConnect.js'
import authRouter from './routes/authUser.js'
import messageRouter from './routes/messageRoute.js'
import userRouter from './routes/userRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors';
//const app = express()// iski jagah ab 
import {app, server} from './Socket/socketio.js'
import path from 'path'

 const __dirname = path.resolve();// use for sending project live

 dotenv.config()
 
 app.use(cors()); // Default allow all origins
 app.use(express.json());
 app.use(cookieParser());
 

 app.use('/api/auth',authRouter);
 app.use('/api/message',messageRouter)
 app.use('/api/user',userRouter)

 app.use(express.static(path.join(__dirname,"/frontend/dist")))//uee path here to send project live

 app.get('*splat',(req,resp)=>{
    resp.sendFile(path.join(__dirname,"frontend","dist","index.html"))
})

app.get('/',(req,resp)=>{
    resp.send("server is running")
})

const PORT = process.env.PORT || 3000
// now when using socket IO we use server insted of app
server.listen(PORT,()=>{
    dbConnect();
    console.log(`working at ${PORT}`)
})
// app.listen(PORT,()=>{
//     dbConnect();
//     console.log(`working at ${PORT}`)
// })
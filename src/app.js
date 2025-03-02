import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import {User} from "./models/user.model.js"
import path from "path";
import {fileURLToPath} from "url"
import http from "http";
import { Server } from "socket.io";

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename)
const app=express()
const server=http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ["GET", "POST"],
      },
});

let users=[];
io.on('connection',socket=>{
    socket.on('addUser',userId=>{
        const isUserExist=users.find(user=>user.userId===userId)

        if (!isUserExist) {
            const user={userId,socketId: socket.id};
            users.push(user)
            io.emit('getUser',users);
        }
    });
    socket.on("removeUser",userId=>{
        users=users.filter(user=>user.userId!==userId)
    });
    socket.on('sendMessage',async({messageId, senderId,receiverId,message,conversationId})=>{
        const receiver= users.find(user=>user.userId===receiverId);
        const sender=  users.find( user=>user.userId===senderId)
        const user=await User.findById(senderId)
        if(receiver){
            io.to(receiver.socketId).to(sender.socketId).emit('getMessage',{
                senderId,
                messageId,
                message,
                conversationId,
                receiverId,
                user:{ id:user._id,fullname:user.fullName}
            })
        }else{
            io.to(sender.socketId).emit('getMessage',{
                senderId,
                messageId,
                message,
                conversationId,
                receiverId,
                user:{ id:user._id,fullname:user.fullName}
            })
        }
    })
    socket.on('sendFile',async({messageId, senderId,receiverId,message,conversationId})=>{
        const receiver= users.find(user=>user.userId===receiverId);
        const sender=  users.find( user=>user.userId===senderId)
        const user=await User.findById(senderId)
        if(receiver){
            io.to(receiver.socketId).to(sender.socketId).emit('getFileMessage',{
                senderId,
                messageId,
                message,
                conversationId,
                receiverId,
                user:{ id:user._id,fullname:user.fullName}
            })
        }else{
            io.to(sender.socketId).emit('getFileMessage',{
                senderId,
                messageId,
                message,
                conversationId,
                receiverId,
                user:{ id:user._id,fullname:user.fullName}
            })
        }
    })
    socket.on('deleteMessage',({messages,senderId,receiverId})=>{
        const receiver= users.find(user=>user.userId===receiverId);
        const sender=  users.find( user=>user.userId===senderId)
        if (receiver) {
            io.to(sender.socketId).to(receiver.socketId).emit('deletedMessage',{
                messages
            })
        } else {
            io.to(sender.socketId).emit('deletedMessage',{
                messages
            })
        }
    })
    socket.on('clearChat',({senderId,receiverId})=>{
        const receiver= users.find(user=>user.userId===receiverId);
        const sender=  users.find( user=>user.userId===senderId)
        if (receiver) {
            io.to(sender.socketId).to(receiver.socketId).emit('chatCleared',{
            })
        } else {
            io.to(sender.socketId).emit('chatCleared',{
            })
        }
    })
    socket.on('deleteChat',({senderId,receiverId})=>{
        const receiver= users.find(user=>user.userId===receiverId);
        const sender=  users.find( user=>user.userId===senderId)
        if (receiver) {
            io.to(sender.socketId).to(receiver.socketId).emit('chatDeleted',{
            })
        } else {
            io.to(sender.socketId).emit('chatDeleted',{
            })
        }
    })
    socket.on('disconnect',()=>{
        users=users.filter(user=>user.socketId!==socket.id);
        io.emit('getUser',users);
    })



})




app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({extended:true, limit: "20kb"}))

app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/user.routes.js"
import chatRouter from "./routes/chat.routes.js"
import messageRouter from "./routes/message.routes.js"
import emailRouter from "./routes/email.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/chat",chatRouter)
app.use("/api/v1/message",messageRouter)
app.use("/api/v1/email",emailRouter)

const frontendPath = path.resolve(__dirname, "../frontend/build"); // Move one level up
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});



export {app}
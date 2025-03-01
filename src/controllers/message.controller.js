import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Chat} from "../models/chat.model.js";
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from "../models/user.model.js";
import {Message} from "../models/message.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const createMessage=asyncHandler(async(req,res)=>{
    const {conversationId,senderId,message,messageType}=req.body
    
    if(!(senderId)){
        throw new ApiError(400,"conversation id and sender id both are required ")
    }
    if(message===''){
        return 
    }
    const sender=await User.findById(senderId)
    if (!sender) {
        throw new ApiError(404,"invalide sender id(sender does not exist)")
    }
    const isValidConversationId= await Chat.findById(conversationId)
    if(!isValidConversationId){
        throw new ApiError(404,"invalid conversation id")
    } 
    const newMessage=await Message.create({
        chatId: conversationId,
        messageType:messageType||"text",
        senderId: senderId,
        message: message
    })
    return res.status(200).json(new ApiResponse(200,newMessage,"message sent successfully"))
})
const createFileMessage=asyncHandler(async(req,res)=>{
    const {conversationId,senderId}=req.body
    const fileLocalPath=req.file?.path
    if(!(senderId)){
        throw new ApiError(400,"conversation id and sender id both are required ")
    }
    if (!(fileLocalPath)) {
        throw new ApiError(401,"file is not send");
        
    }
    const filePath=await uploadOnCloudinary(fileLocalPath)
    if (!filePath.url) {
        throw new ApiError(400,"error while uploading file on cloudinary")
    }
    const sender=await User.findById(senderId)
    if (!sender) {
        throw new ApiError(404,"invalide sender id(sender does not exist)")
    }
    const isValidConversationId= await Chat.findById(conversationId)
    if(!isValidConversationId){
        throw new ApiError(404,"invalid conversation id")
    } 
    const newMessage=await Message.create({
        chatId: conversationId,
        messageType:"file",
        senderId: senderId,
        message: filePath?.url
    })
    return res.status(200).json(new ApiResponse(200,newMessage,"message sent successfully"))
})

const fetchMessage=asyncHandler(async(req,res)=>{
    const {conversationId}=req.params
    if(conversationId==''){
        return res.status(200).json(new ApiResponse(200,{},"fetched successfully"))
    }
    const isValidConversationId=await Chat.findById(conversationId)
    if(!isValidConversationId){
        throw new ApiError(404,"conversation id doesn't exist")
    }
    const messages=await Message.find({chatId:conversationId})
    const messageData=Promise.all(messages.map(async(message)=>{
        const sender=await User.findById(message.senderId)
        return {id:message._id, senderId:message.senderId, sender: sender.fullname, message:message.message,messageType:message.messageType}
    }))
    return res.status(200).json(new ApiResponse(200,await messageData,"message fetched successfully"))
})

const deleteMessage=asyncHandler(async(req,res)=>{
    const {messageId, userId}= req.body

    const messageData=await Message.findById(messageId)

    if (!messageData) {
        throw new ApiError(404,"no message found with this id")
    }
    if(messageData.senderId!==userId){
        throw new ApiError(401,"unauthorized user acess")
    }
    const deletedMessage= await Message.findByIdAndDelete(messageId)
    if(!deletedMessage){
        throw new ApiError(500,"something went wrong while deleting message")
    }
    return res.status(200).json( new ApiResponse(200,{},"message deleted successfully"))
    
})

const clearChat=asyncHandler(async(req,res)=>{
    const {conversationId}=req.body
    if(!conversationId){
        throw new ApiError(400,"conversation id is required")
    }
    const message= await Message.deleteMany({
        chatId:conversationId
    })
    if (!message) {
        throw new ApiError(500,"something went wrong while deleting")
    }
    return res.status(200).json(new ApiResponse(200,{},"chat clear successfully"))
})



export {createMessage, fetchMessage, deleteMessage,clearChat,createFileMessage}
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Chat} from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import {ApiResponse} from '../utils/ApiResponse.js'
import { User } from "../models/user.model.js";

const createChat= asyncHandler(async(req,res)=>{

    const {firstuserid, seconduserid}=req.body
    if (!( firstuserid && seconduserid)) {
        throw new ApiError(400,"invalid userId or recieverId")
    }
    const ischatExist=await Chat.findOne({members: { $all: [firstuserid, seconduserid] }})
    if(ischatExist){
        return res.status(401).json(new ApiResponse(401,ischatExist,"chat already exist"))
    }
    const chat= await Chat.create({
        members:[firstuserid,seconduserid]
    })
    return res.status(201).json(new ApiResponse(201,chat,"chat created successfully"))

})

const fetchChats=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    if(!userId){
        throw new ApiError(400,"invalid user id")
    }
    const conversations=await Chat.find({members: {$in : [userId]}})
    const conversationUserData=Promise.all( conversations.map(async(conversation)=>{
        const recieverId=conversation.members.find((member)=> member!=userId)
        const user= await User.findById(recieverId).select("-password")
        return { reciever: user, conversationId: conversation._id}
    }))

    return res.status(200).json(new ApiResponse(200,await conversationUserData,"chats fetched successfully"))
})
const getCoversationId=asyncHandler(async(req,res)=>{
    const {userId,recieverId}=req.query
    if (!(userId&& recieverId)) {
        throw new ApiError(400,"both ids are required")
    }
    const conversation=await Chat.findOne({members: { $all: [userId, recieverId] }})
    let conversationId=''
    if (conversation) {
        conversationId=conversation._id
    }
    return res.status(200).json(new ApiResponse(200,{conversationId},"successfull"))
})

const deleteChat=asyncHandler(async(req,res)=>{
    const {conversationId,userId}=req.body
    if(!(conversationId && userId)){
        throw new ApiError(400,"ids is required")
    }
    const chat=await Chat.findById(conversationId)
    if (!chat) {
        throw new ApiError(404,"no chat found")
    }
    if (!(chat.members.includes(userId))) {
        throw new ApiError(401,"unauthorized access")
    }
    const message= await Message.deleteMany({
        chatId:conversationId
    })
    const deletedChat=await Chat.findByIdAndDelete(conversationId)
    if (!deleteChat) {
        throw new ApiError(500,"some internal server error")
    }
    return res.status(200).json(new ApiResponse(200,{},"chat deletd sucessfully"))
})


export {createChat, fetchChats,getCoversationId,deleteChat}
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {User} from "../models/user.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import { Verication } from "../models/verification.model.js";

const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}


    } catch (error) {
        throw new ApiError(500,error?.messagee||"something went wrong while generating tokens")
    }
}

const registerUser=asyncHandler(async (req,res)=>{
    const {username,fullname,email,password,code}=req.body

    if ( !(username && fullname && email && password && code)
    ) {
        throw new ApiError(400,"fullname,username ,email and password are required")
    }

    const existedUser=await User.findOne({
        $or: [{email},{username}]
    })
    if (existedUser) {
        throw new ApiError(409,"username or email already exist")
    }
    const verification= await Verication.findOne({email})
    if (!verification) {
        throw new ApiError(500,"something went wrong, we are unable to register at this moment, please try again after few seconds")
    }
    const deletedCode=await Verication.findOneAndDelete({email})

    if (verification?.code!==code) {
        throw new ApiError(400,"verification code does not matched")
    } 
    let dpPath= 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    if (req.file) {
        const dpLocalPath=req.files?.dp[0]?.path
        
        if (dpLocalPath) {
            const dp=await uploadOnCloudinary(dpLocalPath)
            dpPath=dp.url
            if (!dpPath) {
                throw new ApiError(500,"something went wrong while uploading dp")
            }
        }
    }

    const user=await User.create({
        fullname,
        username: username.toLowerCase(),
        dp: dpPath,
        email,
        password
    })
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500,"something went wrong while registering")
    }

    return res.status(201).json(new ApiResponse(201,createdUser,"user regitered successfully"))
    
    
})

const loginUser= asyncHandler(async (req,res)=>{
    const {email,username,password}= req.body
    if(!(username|| email)){
        throw new ApiError(400,"username or email is required")

    }
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if ((!user)) {
        throw new ApiError(404,"user does not exist")
    }
    
    const isPasswordValid=await user.isPasswordCorrect(password)
    
    if(!isPasswordValid){
        
        throw new ApiError(401,"incorrect passwaord ")
    }

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)

    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")


    const options={
        httpOnly:true,
        secure:true
    }

    return res.status(200)
    .cookie("refreshToken",refreshToken,options)
    .json(new ApiResponse(200,{
        user: loggedInUser,accessToken,refreshToken
    },"user logged in successfully"))


})



const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incommingRefreshToken=req.cookies.refreshToken|| req.body.refreshToken
    if (!incommingRefreshToken) {
        throw new ApiError(401,"umauthorized access")
    }
    try {
        const decodedToken=jwt.verify(
            incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401,"invalid refresh Token")
        }
        if (incommingRefreshToken!==user?.refreshToken) {
            throw new ApiError(401,"refresh token is expired")
        }
    
        const options={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    
        res.status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(new ApiResponse(200,{accessToken,refreshToken},"accessToken refreshed successfully"))
    } catch (error) {
        throw new ApiError(401,error?.messagee||"invalid refesh token")
    }


})


const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {username,email,oldPassword,newPassword}=req.body
    //const user=await User.findById(userId)
    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if (!user) {
        throw new ApiError(404,"user not found")
    }

    const isOldPasswordValid=await user.isPasswordCorrect(oldPassword)

    if (!isOldPasswordValid) {
        throw new ApiError(400,"old password is incorrect")
    }
    user.password=newPassword
    user.save({validateBeforeSave:false})

    return res.status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))

})
const resetPassword=asyncHandler(async(req,res)=>{
    const {email,newPassword}=req.body

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(404,"user not found")
    }
    user.password=newPassword
    user.save({validateBeforeSave:false})

    return res.status(200)
    .json(new ApiResponse(200,{},"password changed successfully"))
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    const {incomingRefreshToken}=req.params

    if (!incomingRefreshToken) {
        throw new ApiError(401,"unauthorized access")
    }
    try {
        const decodedToken=jwt.verify(
            incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401,"invalid refresh Token")
        }
        if (incomingRefreshToken!==user?.refreshToken) {
            throw new ApiError(401,"refresh token is expired")
        }
    
        res.status(200)
        .json(new ApiResponse(200,user,"accessToken refreshed successfully"))
    } catch (error) {
        throw new ApiError(401,error?.messagee||"invalid refesh token")
    }

    return res.status(200).json(200,req.user,"current user fetched successfully")
})

const updatedFullname=asyncHandler(async (req,res)=>{
    const {fullname,userId}=req.body
    if(!(fullname)){
        throw new ApiError("fullname is required are required")
    }
    const user=await User.findByIdAndUpdate(userId,{fullname:fullname},{new: true}).select("-password")
    return res.status(200)
        .json(new ApiResponse(200,user,"fullname updated"))

})
const updatedEmail=asyncHandler(async (req,res)=>{
    const {email,userId}=req.body
    if(!(email)){
        throw new ApiError("email is required are required")
    }
    const user=await User.findByIdAndUpdate(userId,{ email:email},{new: true}).select("-password")
    return res.status(200)
        .json(new ApiResponse(200,user,"fullname updated"))

})

const dpUpdate= asyncHandler(async(req,res)=>{
    const {userId}=req.body
    const dpLocalPath=req.file?.path

    if(!dpLocalPath){
        throw new ApiError("400","dp field are empty")
    }
    const user=await User.findById(userId)
    if (!user) {
        throw new ApiError(404,"user not found")
    }
    const commonDp="https://cdn-icons-png.flaticon.com/512/149/149071.png"

    if (user?.dp!==commonDp) {
        const parts = user?.dp.split("/");
        const publicId= parts[parts.length - 1].split(".")[0];
        const result=await deleteFromCloudinary(publicId)
        if(!(result && result?.result=='ok')){
            throw new ApiError(500,"error while deleting  file from cloudinary")
        }
    }

    const dp=await uploadOnCloudinary(dpLocalPath)

    if (!dp.url) {
        throw new ApiError(400,"error while uploading new dp")
    }

    const updatedUser=await User.findByIdAndUpdate(userId,{ $set:{ dp: dp.url}},{new: true}).select("-password")

    return res.status(200)
        .json(new ApiResponse(200,updatedUser,"dp updated"))
})

const allUsers=asyncHandler(async(req,res)=>{
    const keyword= req.query.search? {
        $or: [
            {name: {$regex :req.query.search,$options : "i"}},
            {email: {$regex :req.query.search,$options : "i"}}
        ]
    }: {}
    const users=(await User.find(keyword))

    res.status(200).json(new ApiResponse(200,users,"searching successfully"))


})

export {registerUser,loginUser,
    refreshAccessToken,changeCurrentPassword, getCurrentUser,
    updatedFullname,updatedEmail,dpUpdate,allUsers,resetPassword}
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {sendEmail} from "../middlewares/Email.confiq.js"
import {User} from "../models/user.model.js"
import {Verication} from "../models/verification.model.js"

const generateCode=asyncHandler(async(req,res)=>{
    const {email,context}=req.body
    if(!(email && context)){
        throw new ApiError(400,"all fields are  required")
    }
    const user=await User.findOne({email})
    if(user){
        throw new ApiError(401,"email already exist")
    }
    const deletedCode=await Verication.findOneAndDelete({email})
    const verificationCode=Math.floor(100000+ Math.random()*900000).toString()
    const emailRes= await sendEmail(email,verificationCode)
    if(!emailRes){
        throw new ApiError(500,"something went wrong while sending code to email")
    }
    const verification= await Verication.create({
        email,
        code:verificationCode,
        context
    })
    if(!verification){
        throw new ApiError(500,"something went wrong while generationg code")
    }
    return res.status(200).json(new ApiResponse(200,{},"code generated successfully"))
})

export {generateCode}
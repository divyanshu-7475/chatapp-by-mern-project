import mongoose, { Schema } from "mongoose";

const verificationSchema= new Schema({
    email:{
        type:String,
        index:true,
        required:true
    },
    code:{
        type:String,
    },
    context:{
        type:String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 300 seconds = 5 minutes
    }
})

export const Verication= mongoose.model("Verification",verificationSchema)
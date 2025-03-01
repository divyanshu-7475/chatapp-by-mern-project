//chatName
//isGroupChat
//users
//latest message
//group admin

import mongoose, { Schema } from "mongoose";


const chatSchema= new  Schema( {
    members :{
        type: Array,
        required: true
    }
},
{
    timestamps:true
})

export const Chat= mongoose.model("Chat",chatSchema)
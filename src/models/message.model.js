import mongoose, { Schema, SchemaType } from "mongoose";

const messageSchema= new Schema(
    {
        senderId: {
            type: String,
        },
        messageType:{
            type: String
        },
        message: {

            type:String,
            trim: true
        },
        chatId :{
            type: String,
        }
    },
    {
        timestamps:true
    }
)

export const Message= mongoose.model("Message",messageSchema)
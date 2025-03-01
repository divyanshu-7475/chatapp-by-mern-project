
import { createSlice } from "@reduxjs/toolkit"

const initialState={
    chatOpenUser:null
}
const chatOpenSlice=createSlice({
    name: 'chatOpen',
    initialState,
    reducers: {
        updateChatUser:(state,action)=>{
            const newUser=action.payload
            state.chatOpenUser=newUser
        }
    }
})

export const {updateChatUser}=chatOpenSlice.actions

export default chatOpenSlice.reducer


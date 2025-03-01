import { createSlice } from "@reduxjs/toolkit"

const initialState={
    conversationId:''
}
const conversationIdSlice=createSlice({
    name:'conversationId',
    initialState,
    reducers:{
        updateConversationId:(state,action)=>{
            const newId=action.payload
            state.conversationId=newId
        }
    }
})

export const  {updateConversationId}=conversationIdSlice.actions
export default conversationIdSlice.reducer
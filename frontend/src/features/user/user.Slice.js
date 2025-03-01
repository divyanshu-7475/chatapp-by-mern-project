
import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:{
        _id:"",
        dp:"",
        createdAt:undefined,
        email:"",
        fullname:"",
        updatedAt:undefined,
        username:"",
        
    }
}

export const userSlice=createSlice({
    name: 'user',
    initialState,
    reducers:{
        loginUser:(state,action)=>{
            const newUser=action.payload
            state.user=newUser


        },
        logoutUser: (state,action)=>{
            const newUser={
                _id:"",
                dp:"",
                createdAt:undefined,
                email:"",
                fullname:"",
                updatedAt:undefined,
                username:""
                
            } 
            state.user=newUser
        } 
    }
})

export const {loginUser,logoutUser}=userSlice.actions

export default userSlice.reducer

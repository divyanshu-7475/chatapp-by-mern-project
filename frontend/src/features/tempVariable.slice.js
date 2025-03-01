import { createSlice } from "@reduxjs/toolkit"

const initialState={
    Variable:''
}
const tempVarialeSlice=createSlice({
    name:'tempVariable',
    initialState,
    reducers:{
        updateTempVariable:(state,action)=>{
            const newValue=action.payload
            state.Variable=newValue
        }
    }
})

export const  {updateTempVariable}=tempVarialeSlice.actions
export default tempVarialeSlice.reducer
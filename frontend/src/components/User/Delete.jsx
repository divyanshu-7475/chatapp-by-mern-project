import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {updateTempVariable} from "../../features/tempVariable.slice"
import axios from 'axios'
import { loginUser } from '../../features/user/user.Slice'


const Delete=({name,func})=>{
  const dispatch=useDispatch()
  const loggedInUser=useSelector(state=>state.userData)?.user
  const conversationId=useSelector((state) => state.conversationId)?.conversationId


  const clearDeleteChat=()=>{
    
    let opt
    if (name==="Clear") {
      opt="clear"
    } else {
      opt="delete"
    }
    axios.post(`${window.location.origin}/api/v1/chat/${opt}`,{
      conversationId:conversationId,
      userId:loggedInUser?._id
    }).then((res)=>{
      dispatch(updateTempVariable(`${opt} chat`))
    }).catch((err)=>{
      console.log(err)
    })
  }
  const removeDp=()=>{
    axios.post(`${window.location.origin}/api/v1/users/dp/remove`,{
      userId:loggedInUser._id
    }).then((res)=>{
      dispatch(loginUser(res.data.data))
      func()
    }).catch((err)=>{
      console.log("err",err)
    })
  }





  return (
    <div>
        <div
                  className={`w-full  flex justify-center items-center relative  ${name==="remove"?"-top-24":"-top-20"}`}
                >
                  <div className="w-[90%] sm:w-2/5 h-36 border rounded-xl">
                  {name==="remove"? 
                  <div className=' h-[98%] absolute sm:w-1/2 w-[89.4%] '>
                    <div className="w-full h-1/2 bg-gray-500 rounded-t-xl font-semibold text-xl flex items-center justify-center">
                      {name} ?
                    </div>
                    <div className="w-full h-1/2 flex items-center bg-gray-700 rounded-b-xl ">
                      <div
                        className="w-2/5 h-3/5 border text-lg flex justify-center rounded-xl m-2 pt-1 ml-6 cursor-pointer bg-red-500"
                        onClick={removeDp}
                      >
                        {name}
                      </div>
                      <div
                        className="w-2/5 h-3/5 border text-lg flex justify-center rounded-xl m-2 pt-1 cursor-pointer bg-gray-500"
                        onClick={func}
                      >
                        Cancel
                      </div>
                    </div> </div>:
                  <div className='w-full h-full'>
                    <div className="w-full h-1/2 bg-gray-500 rounded-t-xl font-semibold text-xl flex items-center justify-center">
                      {name} chat?
                    </div>
                    <div className="w-full h-1/2 flex items-center bg-gray-700 rounded-b-xl ">
                      <div
                        className="w-2/5 h-3/5 border text-lg flex justify-center rounded-xl m-2 pt-1 ml-6 cursor-pointer bg-red-500"
                        onClick={()=>{clearDeleteChat()}}
                      >
                        {name}
                      </div>
                      <div
                        className="w-2/5 h-3/5 border text-lg flex justify-center rounded-xl m-2 pt-1 cursor-pointer bg-gray-500"
                        onClick={()=>{dispatch(updateTempVariable("cancel"))}}
                      >
                        Cancel
                      </div>
                    </div> </div>}
                  </div>
                </div>
    </div>
  )
}


export {Delete}
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {updateTempVariable} from "../../features/tempVariable.slice"
import axios from 'axios'

const Delete=({name})=>{
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





  return (
    <div>
        <div
                  className={`w-full  flex justify-center items-center relative -top-20`}
                >
                  <div className="w-[90%] sm:w-2/5 h-36 border rounded-xl">
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
                    </div>
                  </div>
                </div>
    </div>
  )
}


export {Delete}
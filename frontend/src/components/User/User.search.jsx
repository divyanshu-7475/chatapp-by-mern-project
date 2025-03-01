import React, { useState } from 'react'
import {useSelector, useDispatch} from "react-redux"
import axios from "axios"
import { useEffect } from 'react'
import { updateChatUser } from "../../features/user/chatOpen.Slice";
import { updateConversationId } from "../../features/user/conversationId.slice";

const UserSearch=()=> {
    const userDetail=useSelector(state=>state.userData)
    const dispatch=useDispatch()
    const loggedInUser=userDetail.user
    const [keyword,setKeyword]=useState('')
    const [message,setMessage]=useState('type username or email to find users')
    const [users,setUsers]=useState([
    ])

    const searchUser=()=>{
        axios.get(`${window.location.origin}/api/v1/users/search/?search=${keyword}`)
        .then(async(response)=>{
            
            setUsers(response.data.data)
            if(response.data.data.length==0) setMessage("no user found")
        }).catch((err)=>{
            console.log(err)
            setMessage('internal server error, try again')
        })
    }

    const userClicked=(user)=>{
        axios.get(`${window.location.origin}/api/v1/chat/conversationid/?userId=${loggedInUser?._id}&recieverId=${user._id}`)
        .then((response)=>{
            dispatch(updateChatUser(user))
            dispatch(updateConversationId(response.data.data.conversationId))
        }).catch((error)=>{
            console.log(error)
        })
    }
    
    
  return (
    <div className='w-full h-full flex justify-center'>
        <div className='w-[60%] h-full border rounded-xl mt-10 overflow-hidden bg-stone-700' >
            <div className='flex justify-center' >
                <input className='rounded-l-xl w-[85%] h-12 bg-gray-300 text-lg text-black' type="text" onChange={(e)=>{setKeyword(e.target.value)}} />
                <div className='w-0.5 '></div>
                <div className='bg-gray-300 h-12 w-[15%] p-3 pl-2 rounded-r-lg cursor-pointer'onClick={searchUser}>
                <svg  xmlns="http://www.w3.org/2000/svg"  width="30"  height="30"  viewBox="0 0 24 24"  
                fill="none"  stroke="black"  stroke-width="2"  stroke-linecap="round"  
                stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-search">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" /></svg>
                </div>
            </div>
            <div className=' mt-4 overflow-scroll scrollbar-hide '>
                {
                    users.length>0?
                    users.map((user)=>{
                        return(
                            <div className='flex mb-3 cursor-pointer hover:bg-gray-600 pl-2 ' onClick={()=>{userClicked(user)}}>
                                <img src={user.dp} className='w-14 h-14 rounded-full mr-2'  />
                                <div className='mt-3 text-2xl'>{user.username}</div>
                            </div>
                        )
                    }): 
                    <div className=' h-60 flex justify-center items-end '>{message}</div>
                }
            </div>
        </div>
    </div>
  )
}


export {UserSearch}

import React, { useState } from 'react'
import axios from 'axios'

const PasswaordChange=()=>{
    const [usernameEmail,setUsernameEmail]=useState('')
    const [oldPassword,setOldPassword]=useState('')
    const [newPassword,setNewPassword]=useState('')
    const [isChanges,setIsChanged]=useState(false)

    const change=()=>{
        
        axios.post(`${window.location.origin}/api/v1/users/password`,{
            email:usernameEmail,
            oldPassword:oldPassword,
            newPassword:newPassword
        }).then((res)=>{
            setIsChanged(true)
        }).catch((err)=>{
            console.log(err)
        })
    }
  return (
    <div className='w-full h-full '>
        {isChanges && <div className='w-full h-[10%] flex justify-center'>Password changes successfully</div>}
        <div className='w-full h-[60%] flex  flex-col justify-center items-center'>
            <span className='w-[61.5%] text-gray-400'>Username/Email</span>
            <input 
            type="text" 
            className='w-3/5 h-10 rounded-md bg-slate-300 text-black text-base m-1 mb-5'
            placeholder='type username or email'
            onChange={(e)=>{setUsernameEmail(e.target.value)}}
             />
             <span className='w-[61.5%] text-gray-400'>current Password</span>
            <input 
            type="text" 
            className='w-3/5 h-10 rounded-md bg-slate-300 text-black text-base m-1 mb-5'
            placeholder='type your current password'
            onChange={(e)=>{setOldPassword(e.target.value)}}
             />
             <span className='w-[61.5%] text-gray-400'>New Password</span>
            <input 
            type="text" 
            className='w-3/5 h-10 rounded-md bg-slate-300 text-black text-base m-1 mb-5'
            placeholder='type new password'
            onChange={(e)=>{setNewPassword(e.target.value)}}
             />
            
        </div>
        <div className='w-full h-1/5 flex justify-center items-center'>
        <div className={`w-3/5 h-1/2 border rounded-xl bg-red-500 text-black flex justify-center items-center
         text-xl font-bold ${(usernameEmail && oldPassword && newPassword)?" cursor-pointer":"cursor-not-allowed opacity-50"} `}
         onClick={()=>{change()}}
        >Change Password</div>
        </div>
        
    </div>
  )
}
export {PasswaordChange}

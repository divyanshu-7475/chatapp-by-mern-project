import React, { useState } from 'react'
import axios from 'axios'
import {useDispatch,useSelector} from "react-redux"
import {loginUser} from "../../features/user/user.Slice"
export default function UserProfileInput({name}) {
    const [inputValue,setInputValue]=useState('')
    const [result,setResult]=useState('')
    const [color,setColor]=useState('white')
    const dispatch=useDispatch()
    const userDetails=useSelector(state=>state.userData)
    const user=userDetails.user
    
    const updatedetails=()=>{
        if (name==='Name' || name==="name") {
            if (inputValue!=='') {
                axios.post(`${window.location.origin}/api/v1/users/fullname`,{
                    fullname:inputValue,
                    userId:user?._id

                }).then((response)=>{
                    dispatch(loginUser(response.data.data))
                    setResult("Name changed successfully")
                    setColor('green-400')
                }).catch((error)=>{
                    console.log("error while updating fullname",error)
                    setResult("some error! ocuured, try again")
                    setColor("red-800")
                })
                setInputValue('')
            }
            
        }else{
            if (inputValue!=='') {
                axios.post(`${window.location.origin}/api/v1/users/email`,{
                    email:inputValue,
                    userId:user?._id
                }).then((response)=>{
                    dispatch(loginUser(response.data.data))
                    setResult("Name changed successfully")
                    setColor('green-400')
                }).catch((error)=>{
                    console.log("error while updating fullname",error)
                    setResult("some error! ocuured, try again")
                    setColor("red-800")
                })
                setInputValue('')
            }
            
        }
        
    }

  return (
 <div>
    <div className='w-full h-[300px]'>
        <div className='w-full flex flex-col h-full border rounded-3xl p-5 bg-gray-500 '>
        <span className='mb-2 text-lg ml-2 mt-8' >{name}</span>
        <input className='h-10 rounded-xl mb-8' type={`${name==='Email'? 'email':'text'}`} name='Name' onChange={(e)=>{setInputValue(e.target.value)}} />
        <button type='submit' className='h-10 border bg-green-400 text-lg text-black m-5' onClick={updatedetails} >Submit</button>
        {result===''? <div ></div>: <div className={`w-full flex justify-center text-${color} font-semibold`}>{result}</div> }
        </div>
    </div>

 </div>
  )
}
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../Modal/Modal'

const ChatWithProfile=({closeModal})=>{
  const chatWith=useSelector(state=>state.chatOpenUser)?.chatOpenUser
  const loggedInUser=useSelector(state=>state.userData)?.user
  const [dpView,setDpView]=useState(false)

  const closeDpView=()=>{
    setDpView(false)
  }

  return (
    <div className='w-full h-full'>
      <div className='w-full flex justify-center mt-5'>
        <img src={chatWith?.dp} alt="" 
        className='sm:w-[140px] w-[120px] h-[120px] sm:h-[140px]  rounded-full cursor-pointer'
        onClick={()=>{setDpView(true)}}
         />
      </div>
      <div className='w-full h-80  flex flex-col justify-between items-center mt-5'>
        <div className='w-1/2  h-28'>
        <div className='mt-1'>
          <span className='text-gray-400'>Username</span>
          <h1 className='text-3xl ml-1.5'>{chatWith?.username}</h1>
        </div>
        <div className='mt-1'>
          <span className='text-gray-400'>Fullname</span>
          <h1 className='text-3xl ml-1.5'>{chatWith?.fullname}</h1>
        </div>
        
        </div>
        <div className='mb-5 w-full flex justify-end mr-5 cursor-pointer ' onClick={()=>closeModal()}>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="45"  height="45"  viewBox="0 0 24 24"  fill="none"  
        stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon 
        icon-tabler icons-tabler-outline icon-tabler-message drop-shadow-xl"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M8 9h8" /><path d="M8 13h6" /><path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 
        0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z" /></svg>
        </div>
        {dpView && <Modal closeModal={closeDpView} image={{message:chatWith?.dp}}/>}

      </div>
      
      
    </div>
  )
}
export default ChatWithProfile
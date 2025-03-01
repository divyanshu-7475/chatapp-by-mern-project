import React, {useEffect, useState} from 'react'
import Input from "./User.profile.input.jsx"
import {useSelector} from "react-redux"
import {useNavigate} from "react-router-dom"
import Modal from '../Modal/Modal.jsx'
import ModalSmallScreen from '../Modal/Modal.smallScreen.jsx'

export default function UserProfile() {
    
    const navigate=useNavigate()
    
    const userDetail = useSelector((state) => state.userData);
    const user=userDetail.user
    const dp=user?.dp ||'https://cdn-icons-pngflaticon..com/512/149/149071.png'
    const [edit,setEdit]=useState(false)
    const [passValue,setPassValue]=useState('')
    const [openModal,setOpenModal]=useState(false)
    const [dpView,setDpView]=useState(false)
    const [changePasswaord,setChangePasswaord]=useState(false)
    const editFunction=(value)=>{
        setEdit(true)
        setPassValue(value)
    }
    const closeModal=()=>{
        setOpenModal(false)
        setDpView(false)
        setChangePasswaord(false)
    }

  return (
    <>
    <div className='w-screen h-[99vh] p-1 '>
        <div className={`${edit?" opacity-20 touch-none ":''}`}>
        <div className='w-full h-[15vh]  flex justify-center items-end pb-2'>
        <div className="flex w-4/5 sm:w-[70%]  ">
          <img
            src="https://res.cloudinary.com/dxr8h1oud/image/upload/v1730861538/w3qwunkvbis7phxzteno.png"
            alt="app-logo"
            className=" rounded-3xl w-20 h-20  "
          />
          <div className="ml-2 flex flex-col h-full justify-center pt-4 ">
            <h2 className='font-brush text-3xl'>SayHello</h2>
            <h4 className='relative -top-2'>
              <i>Let's Chat</i>
            </h4>
          </div>
        </div>
        </div>
        <div className='w-full h-auto flex justify-center'>
        <div className='sm:w-3/5 w-4/5 h-4/5 '>
        <div className='w-full flex '>
            <div className='sm:m-3 m-1 mt-2 cursor-pointer' onClick={()=>navigate(-1)}>
            <svg  xmlns="http://www.w3.org/2000/svg"  width="32"  height="32"  viewBox="0 0 24 24"  
            fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
            class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left"><path stroke="none" d="M0 0h24v24H0z" 
            fill="none"/><path d="M5 12l14 0" /><path d="M5 12l6 6" />
            <path d="M5 12l6 -6" /></svg>
            </div>
            <div className='relative sm:text-3xl text-2xl font-bold mt-2'>Profile</div>
        </div>
        <div className='w-full'>
            <div className='w-full flex justify-center mt-4 -ml-8'>
                <img src={dp} className='sm:w-40 sm:h-40 w-28 h-28 rounded-full cursor-pointer' onClick={()=>{setDpView(true)}} />
                <div className='border sm:w-12 sm:h-12 w-9 h-9 p-1 pl-1.5 bg-green-800 rounded-full cursor-pointer relative sm:top-28 sm:-left-14 top-20 -left-9'
                onClick={()=>{setOpenModal(true)}}
                >
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  
                fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  
                stroke-linejoin="round"  className=" sm:w-9 sm:h-9 icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path 
                stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 
                -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" />
                </svg>
                </div>
                {openModal && <Modal closeModal={closeModal} useFor={"dp"} />}
                {dpView && <Modal closeModal={closeModal} image={{message:dp}}/>}
            </div>
            <div className='w-full mt-5'>
                <div className='w-full flex justify-center'>
                    <span className='w-[90%] opacity-70'>Name</span>
                </div>
                <div className='w-full flex justify-center pl-0.5 -mt-2'>
                    <div className='sm:w-[70%] w-[75%]   text-2xl '>{user?.fullname}</div>
                    <div className='w-[15%] mt-1.5 cursor-pointer' onClick={()=>{editFunction("Name")}}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="32"  height="26"  viewBox="0 0 24 24"  
                        fill="none"  stroke="green"  stroke-width="2"  stroke-linecap="round"  
                        stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path 
                        stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 
                        -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" />
                        </svg>
                    </div>
                    </div>
            </div>
            <div className='w-full flex justify-center relative -left-10'><hr className='sm:w-[80%] w-[60%] opacity-10' /></div>
            <div className='w-full mt-5'>
                <div className='w-full flex justify-center'>
                    <span className='w-[90%] opacity-70'>Username</span>
                </div>
                <div className='w-full flex justify-center pl-0.5  -mt-2'>
                    <div className='sm:w-[85.5%] w-[89%] text-2xl '>{user?.username}</div>
                    </div>
            </div>
            <div className='flex justify-center relative -left-10'><hr className='sm:w-[80%] w-[60%] opacity-10' /></div>
            <div className='w-full mt-5'>
                <div className='w-full flex justify-center'>
                    <span className='w-[90%] opacity-70'>Email</span>
                </div>
                <div className='w-full flex justify-center pl-0.5 -mt-2'>
                    <div className='w-[75%] sm:w-[70%] text-2xl break-words '>{user?.email}</div>
                    <div className='w-[15%] mt-1.5 cursor-pointer' onClick={()=>{editFunction("Email")}}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="32"  height="26"  viewBox="0 0 24 24"  
                        fill="none"  stroke="green"  stroke-width="2"  stroke-linecap="round"  
                        stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-pencil"><path 
                        stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 
                        -4 -4l-10.5 10.5v4" /><path d="M13.5 6.5l4 4" />
                        </svg>
                    </div>
                    </div>
            </div>
            <div className='flex justify-center relative -left-10 '><hr className='w-[60%] sm:w-[80%] opacity-10' /></div>
        </div>
        <div className='w-full flex justify-center mt-8 ml-2'>
            <div className='w-3/5'>
            <div 
            className='w-40 h-10 flex justify-center rounded-3xl cursor-pointer bg-green-500 items-center border text-black'
            onClick={()=>{setChangePasswaord(true)}}
            >Change Password
            </div>
            </div>
            {changePasswaord && <ModalSmallScreen closeModal={closeModal} useFor={"change"}/> }
        </div>
        </div></div>
        </div>
    <div className={`${edit?"":'invisible'} w-screen relative -top-72`}>
        <div className='w-full flex justify-center'> 
        <div className='sm:w-[30%] w-[85%]'><Input name={passValue}/></div>
        <div className=' relative top-1.5 -left-8 cursor-pointer' onClick={()=>{setEdit(false)}}>
        <svg  xmlns="http://www.w3.org/2000/svg"  width="26"  height="26"  viewBox="0 0 24 24"  fill="currentColor"  
        class="icon icon-tabler icons-tabler-filled icon-tabler-xbox-x"><path stroke="none" d="M0 0h24v24H0z" 
        fill="none"/><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10 -10 10s-10 -4.477 -10 -10s4.477 -10 10 -10m3.6 
        5.2a1 1 0 0 0 -1.4 .2l-2.2 2.933l-2.2 -2.933a1 1 0 1 0 -1.6 1.2l2.55 3.4l-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2 
        -2.933l2.2 2.933a1 1 0 0 0 1.6 -1.2l-2.55 -3.4l2.55 -3.4a1 1 0 0 0 -.2 -1.4" />
        </svg>

        </div>
        
        </div>
        </div>
        </div>
    </>
  )
}
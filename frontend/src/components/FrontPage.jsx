
import React,{useState } from "react";
import "./FrontPage.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {useDispatch, useSelector} from "react-redux"
import {Register} from "./FrontPage Components/Register.jsx"

import {loginUser} from "../features/user/user.Slice.js"

let nav='/'


function MainPage(){
    
    const navigate=useNavigate()
    const dispatch=useDispatch()

    
    const [userName,setUserName]=useState('')
    const [password,setPassword]=useState('')
    const [mode,setMode]=useState("login")
    const refreshToken=localStorage.getItem('refreshToken') || ''
    if(refreshToken!==''){
        axios.get(`http://localhost:8000/api/v1/users/current/${refreshToken}`)
        .then((response)=>{
            const user=response.data.data
            dispatch(loginUser(user))
            nav='/user/'+user?._id
            navigate(nav)
        }).catch((error)=>{
            console.log("refresh token expired")
        })
    }



    
    

    

    const Login=async(e)=>{
        e.preventDefault()

        axios.post(`http://localhost:8000/api/v1/users/login`,{
                username:'',
                email:userName,
                password:password
        }).then((response)=>{
            const data=response.data.data
            const username="/user/"+data.user._id
            localStorage.setItem('accessToken',data.accessToken)
            localStorage.setItem('refreshToken',data.refreshToken)
            dispatch(loginUser(data.user))
            
            navigate(username)
            

            
        })
        .catch((error)=>{
            console.log("frontend error:",error)
        })
        
        
        
    }
    
    

    return (
        <>
            <div className='chatBody'>
            <div className='intro'>
                <img src="https://res.cloudinary.com/dxr8h1oud/image/upload/v1730861538/w3qwunkvbis7phxzteno.png" alt="logo-img"className='logo-img'/>
                <div className="app-name">
                    <h1>SayHello</h1>
                    <h3><i>Let's Chat</i></h3>
                    <div className="flex"> 
                    <div className={`w-auto h-8 border pt-0.5 pb-0.5 pl-1.5 pr-1.5 rounded-xl m-1
                         cursor-pointer ${mode==='login'?"bg-red-600":"bg-blue-500"}`}
                         onClick={()=>{setMode("login")}}
                         >Login</div>
                    <div className={`w-auto h-8 border pt-0.5 pb-0.5 pl-1.5 pr-1.5 rounded-xl m-1
                         cursor-pointer ${mode==='register'?"bg-red-600":"bg-blue-500"}`}
                         onClick={()=>{setMode("register")}}
                         >Register</div>
                    </div>
                </div>
            </div>
            {mode==="login"?
            <div id="login">
                <div className="form-body">
                    <form  className="login-form">
                        <label htmlFor="username">Enter Username/Email</label>
                        <input type="text" onChange={(e)=>{setUserName(e.target.value)}} id="username" name="username" required />
                        <label htmlFor="password">Enter password</label>
                        <input type="text" onChange={(e)=>{setPassword(e.target.value)}} id="password"  name="password" required/>
                        
                    </form>
                    <div className="w-full flex justify-center mt-10">
                        <div
                        className="w-[30%] h-10 border rounded-xl bg-red-600 text-lg flex justify-center items-center cursor-pointer"
                        onClick={Login}
                        >Login</div>
                    </div>
                </div>
            </div>: <div> <Register/></div>}
        </div>
        
        </>
    )
}

export  {MainPage}
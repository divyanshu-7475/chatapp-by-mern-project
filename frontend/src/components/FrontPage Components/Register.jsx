import { useEffect, useState } from "react"
import {BeatLoader} from "react-spinners"
import {Modal} from "./Modal.jsx"
import axios from "axios"


function Register() {
    const [userName,setUserName]=useState("")
    const [fullName,setFullName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [message,setMessage]=useState("")
    const [beatLoader,setBeatloader]=useState(false)
    const [openModal,setOpenModal]=useState(false)


    useEffect(()=>{
        setMessage("")
        setBeatloader(false)
    },[userName,fullName,email,password])
    
    

    const sendVerification=()=>{
        setMessage("")
        if(!(userName && fullName && email && password)){
            setMessage("!all field are required to register")
            return
        }
        setBeatloader(true)
        axios.post(`${window.location.origin}/api/v1/email`,{
            email:email,
            context:"new"
        }).then((res)=>{
            
            setMessage("code sent to your email")
            setTimeout(()=>{
                setBeatloader(false)
                setMessage("")
                setOpenModal(true)
            },1000)
            
        }).catch((err)=>{
            const errorHtml = err.response.data; 
            const tempElement = document.createElement("div");
            tempElement.innerHTML = errorHtml;
           const errorMessage = tempElement.querySelector("pre")?.textContent.trim();
           const match = errorMessage?.match(/Error:\s*(.+?)(?:\s+at\s|$)/);
           const extractedMessage = match ? match[1] : "Unknown error";
            setMessage(extractedMessage)

        })
    }

    const closeModal=()=>{
        setOpenModal(false)
        setEmail("")
        setFullName("")
        setUserName("")
        setPassword("")
    }



    return (
        <>
        <div className="w-full h-[65vh] flex justify-center">
        <div className="w-[90%] h-full border mt-2.5 rounded-xl flex flex-col items-center bg-[rgb(188,222,240)]" >
            {message &&<div className="w-4/5 text-lg text-red-600 ">{message}</div>}
            <div  className="w-[70%] h-4/5 flex  flex-col justify-between mt-1">
                <div className=" w-full h-1/5  flex flex-col">
                <span className="mb-1 text-lg text-gray-700 opacity-90">Username</span>
                <input type="text" 
                onChange={(e)=>{setUserName(e.target.value)}} value={userName}
                className="w-full h-3/5 bg-slate-200 rounded-lg text-black text-lg" />
                </div>
                <div className=" w-full h-1/5  flex flex-col">
                <span className="mb-1 text-lg text-gray-700 opacity-90">Fullname</span>
                <input type="text"
                onChange={(e)=>{setFullName(e.target.value)}} value={fullName}
                 className="w-full h-3/5 bg-slate-200 rounded-lg text-black text-lg" />
                </div>
                <div className=" w-full h-1/5  flex flex-col">
                <span className="mb-1 text-lg text-gray-700 opacity-90">Email</span>
                <input type="text" onChange={(e)=>{setEmail(e.target.value)}} value={email}
                 className="w-full h-3/5 bg-slate-200 rounded-lg text-black text-lg" />
                </div>
                <div className=" w-full h-1/5  flex flex-col">
                <span className="mb-1 text-lg text-gray-700 opacity-90">Password</span>
                <input type="text" onChange={(e)=>{setPassword(e.target.value)}} value={password}
                 className="w-full h-3/5 bg-slate-200 rounded-lg text-black text-lg" />
                </div>
            </div>
            <div className="w-full h-[17%]  mt-1 flex justify-center items-center">
                {beatLoader? <div>
                    <BeatLoader loading={true} />
                </div> :
                <div className="w-[30%] h-3/5 border bg-red-600 rounded-2xl text-2xl
                 flex justify-center items-center cursor-pointer" onClick={sendVerification}>Register</div>}
            </div>
            {openModal && <Modal closeModal={closeModal} userDetails={{userName,fullName,email,password}}/>}
        </div>
        </div>
        </>
    )
}
export {Register}
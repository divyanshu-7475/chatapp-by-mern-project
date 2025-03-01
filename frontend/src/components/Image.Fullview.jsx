import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import ModalSmallscreen from "./Modal/Modal.smallScreen"

export default function ImageFullview({closeModal, socket, image,userMessages }) {
  const loggedInUser=useSelector(state=>state.userData).user
  const chatWith=useSelector(state=>state.chatOpenUser).chatOpenUser
  const [isClickedDelete,setIsClickedDelete]=useState(false)
  const [forwardMessage,setForwardMessage]=useState(false)
  const deleteFileMessage = () => {
    setIsClickedDelete(false)
    axios
      .post(`${window.location.origin}/api/v1/message/delete`, {
        messageId: image?.id,
        userId: loggedInUser?._id,
      })
      .then((response) => {
        let tempMessages = [...userMessages];
        tempMessages = tempMessages.filter((message) => message.id !== image?.id);
        socket?.emit("deleteMessage", {
          senderId: loggedInUser?._id,
          receiverId: chatWith?._id,
          messages: tempMessages,
        });
      })
      .catch((error) => {
        console.log("delete error", error);
      });
      closeModal()
  };

  return (
    <div className="w-full h-full ">
      {isClickedDelete && <div className="w-full h-screen absolute flex justify-center items-center ">
        <div className="w-[30%] h-[25%] bg-gray-600 rounded-xl">
          <div className="w-full h-1/2 bg-slate-400 rounded-t-xl text-2xl flex justify-center items-center font-bold text-black">Delete Image?</div>
          <div className="w-full h-1/2 flex justify-center">
          <div className="w-[46%] h-[70%] rounded-xl bg-red-500 mr-1.5 mt-2.5 text-xl font-semibold flex justify-center items-center 
          cursor-pointer hover:bg-red-600" onClick={()=>{deleteFileMessage()}}>Delete</div>
          <div className="w-[46%] h-[70%] rounded-xl bg-green-500 ml-1.5 mt-2.5 text-xl font-semibold flex justify-center items-center 
          cursor-pointer hover:bg-green-600" onClick={()=>{setIsClickedDelete(false)}}>Cancel</div>
          </div>
        </div>
        </div>}
      {image.id? <div>
        <div className="w-full h-10 flex justify-center mb-3">
        <div className="w-32 h-full bg-green-500 flex rounded-xl">
        <div
          className={`w-1/2 hover:bg-green-700 flex items-center justify-center rounded-l-lg`}
          onClick={()=>{setForwardMessage(true)}}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-forward-up"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 14l4 -4l-4 -4" />
            <path d="M19 10h-11a4 4 0 1 0 0 8h1" />
          </svg>
        </div>
        {forwardMessage && <ModalSmallscreen closeModal={closeModal} socket={socket} message={{message:image?.message,messageType:"file"}}/> }
        <div
          className={`w-1/2 hover:bg-green-700 flex items-center justify-center rounded-r-lg cursor-pointer`}
          
        >
          {image?.senderId===loggedInUser?._id ? <div onClick={() => {
            setIsClickedDelete(true);
          }}><svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-trash"
             >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path
              d="M5 7l1 12a2 
                           2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
            />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg> </div> :
          <div className=" cursor-pointer " onClick={()=>{alert("you can't delete message sent by others")}}>
           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  
          stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline 
          icon-tabler-trash-off"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 3l18 18" /><path 
          d="M4 7h3m4 0h9" /><path d="M10 11l0 6" /><path d="M14 14l0 3" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 
          0 2 -2l.077 -.923" /><path d="M18.384 14.373l.616 -7.373" /><path d="M9 5v-1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 
          1v3" /></svg> </div>}
          
        </div>
        </div>
      </div>
      </div>: <div className="w-full h-10"></div> }
      
      <div className="w-full h-full flex justify-center items-center">
        <img src={image?.message} alt="" className="w-1/2" />
      </div>
      
    </div>
  );
}
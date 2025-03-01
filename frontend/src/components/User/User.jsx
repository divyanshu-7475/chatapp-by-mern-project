import "react-image-crop/dist/ReactCrop.css"
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./User.css";
import axios from "axios";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";
import { updateChatUser } from "../../features/user/chatOpen.Slice";
import { updateConversationId } from "../../features/user/conversationId.slice";
import { UserSearch } from "../User/User.search.jsx";
import { Delete } from "./Delete.jsx";
import { updateTempVariable } from "../../features/tempVariable.slice.js";
import ImageCropper from "../ImageCroper/ImageCropper.jsx";
import Modal from "../Modal/Modal.jsx";
import ModalSmallScreen from "../Modal/Modal.smallScreen.jsx";


function User() {
  const tempVariable=useSelector(state=>state.tempVariable).Variable
  
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.userData);
  const loggedInUser = userDetail.user;
  const dispatch = useDispatch();
  //const loggedInUser=JSON.parse(localStorage.getItem('user'))
  const [conversations, setConversations] = useState([]);
  const [userMessages, setUserMessages] = useState([]);
  const [messageOption, setMessagOption] = useState(null);
  const [isClickedDelete, setIsClickedDelete] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState("");
  const [clearDeleteChat,setClearDeleteChat]=useState("")
  const [typedMessage, setTypedMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [newChat, setNewChat] = useState(false);
  const [openModal,setOpenModal]=useState(false)
  const [chatUserProfile,setChatUserProfile]=useState(false)
  const [imageView,setImageView]=useState(false)
  const [forwardMessage,setForwardMessage]=useState(false)

  const conversationIdDetails = useSelector((state) => state.conversationId);
  const chatWithDetails = useSelector((state) => state.chatOpenUser);

  const messageREf = useRef(null);
  useEffect(()=>{
          const refreshToken=localStorage.getItem('refreshToken')
          
       
           if (!refreshToken) {
              socket?.emit("removeUser",loggedInUser._id)
              navigate("/")
          }
      })

  const userDp =
    loggedInUser?.dp || "https://cdn-icons-pngflaticon..com/512/149/149071.png";

  useEffect(() => {
    const fetchConversations = () => {
      axios
        .get(
          `${window.location.origin}/api/v1/chat/fetchconversation/${loggedInUser?._id}`
        )
        .then((response) => {
          setConversations(response.data.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    };
    fetchConversations();
  },[userMessages]);
  //console.log(conversations)

  const [conversationId, setConversationId] = useState("");
  const [chatWith, setChatWith] = useState(null);


  function logout() {
    
    socket?.emit("removeUser",loggedInUser._id)
    localStorage.clear()
     navigate("/")
  }



  useEffect(() => {
    messageREf?.current?.scrollIntoView({ behavior: "smooth" });
    
  }, [userMessages,tempVariable]);

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", loggedInUser?._id);
    socket?.on("getUser", (users) => {
      console.log("active users", users);
    });
    socket?.on("getMessage", (data) => {
      setUserMessages((prev) => [
        ...prev,
        {
          id: data.messageId,
          senderId: data.senderId,
          sender: data.user.fullname,
          message: data.message,
          messageType:"text"
        },
      ]);
    });
    socket?.on("getFileMessage", (data) => {
      setUserMessages((prev) => [
        ...prev,
        {
          id: data.messageId,
          senderId: data.senderId,
          sender: data.user.fullname,
          message: data.message,
          messageType:"file"
        },
      ]);
    });
    socket?.on("deletedMessage", (data) => {
      setUserMessages(data.messages);
    });

    socket?.on("chatCleared",(data)=>{
      setUserMessages([])
    });
    socket?.on("chatDeleted",(data)=>{
      dispatch(updateConversationId(''))
      dispatch(updateChatUser(''))
      dispatch(updateTempVariable('cancel'))
    })
  }, [socket]);

  
  useEffect(() => {
    setChatWith(chatWithDetails?.chatOpenUser);
    setConversationId(conversationIdDetails?.conversationId);
  },[chatWithDetails,conversationIdDetails]);

  const fetchMessage = async (conversationId, reciever) => {
    dispatch(updateConversationId(conversationId));
    dispatch(updateChatUser(reciever));
    setNewChat(false);
    setChatWith(reciever)
    setConversationId(conversationId)
    if (!conversationId) {
      setUserMessages([]);
    } else {
      axios
        .get(`${window.location.origin}/api/v1/message/${conversationId}`)
        .then((response) => {
          //console.log("mssg res",response.data.data)
          setUserMessages(response.data.data);
        });
    }
  };
  const sendMessage = async () => {
    let tempId = conversationId;
    if (conversationId === "") {
      await axios
        .post(`${window.location.origin}/api/v1/chat`, {
          firstuserid: loggedInUser?._id,
          seconduserid: chatWith?._id,
        })
        .then((response) => {
          setConversationId(response.data.data._id);
          tempId = response.data.data._id;
        })
        .catch((error) => {
          console.log("send message error", error);
        });
    }
    axios
      .post(`${window.location.origin}/api/v1/message`, {
        conversationId: tempId,
        senderId: loggedInUser?._id,
        message: typedMessage,
      })
      .then((response) => {
        //console.log(response)
        socket?.emit("sendMessage", {
          messageId: response.data.data._id,
          conversationId: conversationId,
          senderId: loggedInUser?._id,
          receiverId: chatWith._id,
          message: typedMessage,
        });
        setTypedMessage("");
      })
      .catch((error) => {
        console.log("sendmessage error", error);
      });
  };
  const profileClick = () => {
    navigate(`/user/${loggedInUser._id}/profile`);
  };

  const openMessageOption = ({senderId,message,id}) => {
    if(!messageOption){
      setMessagOption({
        senderId:senderId,
        message:message,
        id:id
      })
    }else{
      setMessagOption(null)
    }
  };
  const deleteClick = (messageId) => {
    setDeleteMessageId(messageId);
    setMessagOption({ status: false, id: "", message: "" });
    setIsClickedDelete(true);
  };
  const deleteMessage = () => {
    setIsClickedDelete(false);
    const id = deleteMessageId;
    setDeleteMessageId("");
    axios
      .post(`${window.location.origin}/api/v1/message/delete`, {
        messageId: id,
        userId: loggedInUser?._id,
      })
      .then((response) => {
        let tempMessages = [...userMessages];
        tempMessages = tempMessages.filter((message) => message.id !== id);
        
        socket?.emit("deleteMessage", {
          senderId: loggedInUser?._id,
          receiverId: chatWith?._id,
          messages: tempMessages,
        });
      })
      .catch((error) => {
        console.log("delete error", error);
      });
  };
  useEffect(() => {
    fetchMessage(conversationId, chatWith);
  }, [chatWith, conversationId]);

  const threeDotClick=()=>{
    dispatch(updateTempVariable(''))
    if(clearDeleteChat===''){
      
      setClearDeleteChat('normal')
    }else{
      setClearDeleteChat('')
    }
  }
  const clearDelete=(name)=>{
    setClearDeleteChat(name)
  }
  useEffect(()=>{
        if (tempVariable==="clear chat") {
          socket?.emit('clearChat',{
            senderId:loggedInUser?._id,
            receiverId:chatWith?._id
            });
        } 
        if(tempVariable==='delete chat'){
          socket?.emit('deleteChat',{
            senderId:loggedInUser?._id,
            receiverId:chatWith?._id
            });
        }
  },[tempVariable])

  const closeModal=()=>{
    setOpenModal(false)
    setChatUserProfile(false)
    setImageView(null)
    setForwardMessage(null)
  }
  
  
  return (
    <div className="w-screen h-[99vh] p-1 ">
      <div className={` w-full h-[80px] flex   ${isClickedDelete ? " opacity-15 " : ""}`}>
        <div className="w-2/5 h-[90%] sm:w-[30%]   sm:justify-center flex">
          <img
            src="https://res.cloudinary.com/dxr8h1oud/image/upload/v1730861538/w3qwunkvbis7phxzteno.png"
            alt="app-logo"
            className="w-3/5 h-full rounded-3xl sm:w-[80px] border-2"
          />
          <div className="w-[150px] h-[90%]  ml-2 flex flex-col pt-2  ">
            <h2 className="font-brush text-2xl m-0 sm:text-3xl">SayHello</h2>
            <h4>
              <i className=" relative -top-2">Let's Chat</i>
            </h4>
          </div>
        </div>

        <div className="w-[60%] ml-2 sm:w-[70%] h-[90%]  flex justify-between sm:justify-around items-center sm:pl-8 sm:pr-8 pl-3 pr-1 ">
          <a href="" onClick={profileClick} className="text-lg sm:text-2xl" >
            Profile
          </a>
          <a href="" className="text-lg sm:text-2xl ">Friends</a>
          <button className="rounded-xl hover:bg-red-600 w-[25%] bg-red-500 text-sm h-1/2 sm:h-[70%] sm:text-lg font-semibold " onClick={()=>{logout()}}>Logout</button>
        </div>
      </div>
      <div className=" w-[99%] mt-2.5 mb-2.5 ml-auto mr-auto flex h-full">
      
        <div className={` w-2/5 sm:w-[30%] h-full pl-1.5 border-t-[3px] border-r-[3px] border-green-500 ${isClickedDelete ? " opacity-15 " : ""}`}>
          <div className="w-full h-14 flex justify-between  ">
            <div className="sm:w-3/5 w-4/5 h-full flex items-center  overflow-hidden">
            <img
              className=" w-8 h-8 sm:w-12 sm:h-12 rounded-full mr-0.5  sm:mr-2"
              src={userDp}
            />
            <h2 className="sm:text-2xl">Chats</h2>
            </div>
            <div className="w-1/5   h-full  flex justify-center items-center">
            <div className="sm:w-[75%] w-1/2 h-[68%] flex justify-center items-center rounded-full hover:bg-gray-600">
              <button
              className=" relative sm:-top-1 text-2xl sm:text-4xl font-semibold border-none focus:outline-none focus:ring-0"
                onClick={() => {
                  setNewChat(true);
                }}
              >
                &#43;
              </button>
              </div>
            </div>
          </div>
          <hr />

          <div className="chat-friends overflow-scroll scrollbar-hide">
            {conversations.length > 0 ? (
              conversations.map(({ conversationId, reciever }) => {
                return (
                  <div className="flex  items-center py-3 border-b border-b-gray-300">
                    <div
                      className="cursor-pointer flex items-center "
                      onClick={() => {
                        fetchMessage(conversationId, reciever);
                      }}
                    >
                      <img
                        src={reciever?.dp}
                        alt=""
                        className="sm:w-12 sm:h-12 sm:ml-1 sm:mr-1 w-10 h-10 rounded-full"
                      />
                      <div className="sm:text-lg ml-0.5 font-semibold">
                        {reciever?.fullname}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div></div>
            )}
          </div>
        </div>
        
        <div className="w-full h-100% ">
          
          <div
            className={`${
              newChat ? "" : " invisible"
            } absolute w-4/5 h-4/5 top-10`}
          >
            <UserSearch  />
          </div>
          {(chatWith === null || chatWith==='') ? (
            <div className={`chat-mssgs `}>
              <div className="no-chat">
                <img
                  className="no-chat-img"
                  src="https://res.cloudinary.com/dxr8h1oud/image/upload/v1730861538/w3qwunkvbis7phxzteno.png"
                  alt="app-logo"
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-[99.8%]">
              <div className="w-full h-14 bg-gray-700 flex mt-2 mb-2 ">
              <div
                className={`w-full h-14 flex justify-center m-2 mt-0 ${
                  isClickedDelete ? " opacity-15 " : ""
                }`}
              >
                <div className="sm:w-2/4 w-[90%] h-14 bg-slate-400 flex rounded-3xl ">
                  <div className="flex w-4/5 overflow-hidden cursor-pointer" onClick={()=>{setChatUserProfile(true)}}>
                    <img
                      src={chatWith?.dp}
                      className="w-12 h-4/5 m-1 rounded-full"
                    />
                    <span className="sm:text-3xl text-xl h-[90%] flex items-center font-bold sm:ml-2 ml-1 mr-3 ">
                      {chatWith?.fullname}
                    </span>
                  </div>
                  {chatUserProfile && <Modal useFor={"profile"} closeModal={closeModal}/>}
                 
                </div>
                </div>
                <div className="w-10 h-full p-2 pt-3 cursor-pointer hover:bg-gray-600 self-end" onClick={threeDotClick}>
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
                    class="icon icon-tabler icons-tabler-outline icon-tabler-dots-vertical"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                    <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
                  </svg>
                </div>
              </div>
              <div className={`w-full h-4/5 overflow-scroll scrollbar-hide`}>
                {userMessages.length > 0 ? (
                  userMessages.map(({ id, senderId, sender, message,messageType }) => {
                    if (messageType==="text") {
                    return (
                      <div
                        className={` ${isClickedDelete ? " opacity-15 " : ""}`}
                      >
                        <div
                          className={`mb-1 ${message.length<20?"w-[25%]":""} max-w-[45%]  rounded-b-xl p-4 flex ${
                            senderId === loggedInUser._id
                              ? " bg-blue-500 rounded-tl-xl ml-auto text-white"
                              : "bg-white text-black rounded-tr-xl ml-2"
                          } cursor-pointer`}
                          onClick={() => {
                            openMessageOption({senderId, message,id});
                          }}
                        >
                          {message}
                        </div>
                        <div
                          className={`w-full flex  mt- mb-1 ${
                            senderId === loggedInUser._id
                              ? " justify-end"
                              : "  "
                          }`}
                        >
                          <div className="w-[30%] flex justify-center ml-5">
                          <div
                            className={`w-32 h-8 bg-gray-600  flex justify-between  rounded-lg relative -top-11 ${
                              messageOption!==null
                                ? " translate-y-11 duration-500 cursor-pointer "
                                : "-z-10 "
                            } 
                ${
                  messageOption?.id === id
                    ? " visible "
                    : " invisible "
                }`}
                            
                          >
                           <div className={`${senderId===loggedInUser?._id?"w-1/2":"w-full"} hover:bg-gray-700 flex justify-center rounded-l-lg`}
                           onClick={()=>{setForwardMessage({message:message,messageType:messageType})}}
                           >
                           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  
                           stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
                           class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-forward-up"><path stroke="none" 
                           d="M0 0h24v24H0z" fill="none"/><path d="M15 14l4 -4l-4 -4" /><path d="M19 10h-11a4 4 0 1 0 0 8h1" />
                           </svg>
                           
                           </div>
                           <div className={`${senderId===loggedInUser?._id?"w-1/2":" hidden"} hover:bg-gray-700 flex justify-center rounded-r-lg`}
                           onClick={()=>{deleteClick(id)}}
                           >
                           <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  
                           stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
                           class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" 
                           fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 
                           2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                           </svg>
                           </div>

                          </div>
                          </div>
                        </div>
                        {forwardMessage && <ModalSmallScreen closeModal={closeModal} socket={socket} message={forwardMessage}  />}

                        <div ref={messageREf}></div>
                        
                      </div>
                    );}
                    if(messageType==="file"){
                      return (
                        <div
                        className={` ${isClickedDelete ? " opacity-15 " : ""}`}
                      >
                        <div
                          className={`mb-1 w-full rounded-b-xl p-1 flex ${
                            senderId === loggedInUser._id
                              ? " rounded-tl-xl justify-end text-white"
                              : " text-black rounded-tr-xl"
                          } cursor-pointer`}
                          onClick={() => {
                            setImageView({senderId:senderId,message:message,id:id})
                          }}
                        >
                          <img src={message} alt="" className="w-[30%] " />

                        </div>
                        {(imageView && id===imageView?.id )?<Modal socket={socket} closeModal={closeModal} image={imageView} userMessages={userMessages} />: <div className="invisible"></div> }

                        
                        <div ref={messageREf}></div>
                      </div>
                      );
                    }

                    
                  })
                ) : (
                  <div></div>
                )}
                <div
                  className={`w-full flex justify-center items-center relative -top-44 ${
                    !isClickedDelete ? " invisible" : ""
                  }`}
                >
                  <div className="w-2/5 h-36 border rounded-xl">
                    <div className="w-full h-1/2 bg-gray-500 rounded-t-xl font-semibold text-xl flex items-center justify-center">
                      Delete Message?
                    </div>
                    <div className="w-full h-1/2 flex items-center bg-gray-700 rounded-b-xl ">
                      <div
                        className="w-2/5 h-3/5 border text-lg flex justify-center rounded-xl m-2 pt-1 ml-6 cursor-pointer bg-red-500"
                        onClick={deleteMessage}
                      >
                        Delete
                      </div>
                      <div
                        className="w-2/5 h-3/5 border text-lg flex justify-center rounded-xl m-2 pt-1 cursor-pointer bg-gray-500"
                        onClick={() => {
                          setIsClickedDelete(false);
                        }}
                      >
                        Cancel
                      </div>
                    </div>
                  </div>
                </div>
                {openModal && <Modal closeModal={closeModal} socket={socket} useFor={"send"} /> }
              </div>
              <div
                className={`w-full h-14 mt-1 border border-solid rounded-3xl flex ${
                  isClickedDelete ? " opacity-15 " : ""
                } relative -top-1.5`}
              >
                <input
                  value={typedMessage}
                  onChange={(e) => {
                    setTypedMessage(e.target.value);
                  }}
                  type="text"
                  className=" w-4/5 h-4/5 m-1 ml-5 p-1 pl-5 font-medium outline-none bg-[#242424]	"
                  placeholder="type message here"
                />
                <div className="mt-3 cursor-pointer " onClick={sendMessage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-send"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 14l11 -11" />
                    <path d=" M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                  </svg>
                </div>
                <div className="mt-3 sm:ml-4 ml-2 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="icon icon-tabler icons-tabler-filled icon-tabler-microphone"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M19 9a1 1 0 0 1 1 1a8 8 0 0 1 -6.999 7.938l-.001 2.062h3a1 1 0 0 1 0 2h-8a1 1 0 0 1 
          0 -2h3v-2.062a8 8 0 0 1 -7 -7.938a1 1 0 1 1 2 0a6 6 0 0 0 12 0a1 1 0 0 1 1 -1m-7 -8a4 4 0 0 1 4 4v5a4 
          4 0 1 1 -8 0v-5a4 4 0 0 1 4 -4"
                    />
                  </svg>
                </div>
                <div className="mt-3 sm:ml-4 ml-2 cursor-pointer" onClick={()=>{setOpenModal(true)}}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="icon icon-tabler icons-tabler-outline icon-tabler-photo-plus"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M15 8h.01" />
                    <path d="M12.5 21h-6.5a3 3 0 0 1 -3 -3v-12a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6.5" />
                    <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l4 4" />
                    <path d="M14 14l1 -1c.67 -.644 1.45 -.824 2.182 -.54" />
                    <path d="M16 19h6" />
                    <path d="M19 16v6" />
                  </svg>
                </div>
              </div>
            </div>
          )}
          <div className={`w-full flex justify-end items-start relative -top-[90.7%] ${(clearDeleteChat==="normal")?'':' invisible'} `}>
            <div className="w-36 h-20 bg-gray-400 rounded-sm ">
              <div className="h-1/2 cursor-pointer hover:bg-gray-500 text-lg text-black p-1 pl-2 flex justify-center" onClick={()=>{clearDelete("Delete")}}> Delete chat</div>
              <div className="w-full h-0.5 border border-black"></div>
              <div className="h-1/2 cursor-pointer hover:bg-gray-500 text-lg text-black pt-1 flex justify-center" onClick={()=>{clearDelete("Clear")}}>Clear chat</div>
            </div>
          </div>
          <div className={`flex flex-col justify-center  h-4/5 relative -top-[100%] ${(clearDeleteChat==='Clear' || clearDeleteChat==='Delete')?'':' invisible'} ${(tempVariable==="cancel" || tempVariable.includes("chat"))?' invisible':''}`}>
          <Delete name={clearDeleteChat} />
          </div>
        </div>
      </div>
      
    </div>
  );
}


export { User };
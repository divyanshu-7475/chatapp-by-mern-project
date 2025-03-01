import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
const Forward = ({ closeModal, message, socket }) => {
  const loggedInUser = useSelector((state) => state.userData).user;
  const chatWith = useSelector((state) => state.chatOpenUser).chatOpenUser;
   const conversationIdChatWith = useSelector((state) => state.conversationId).conversationId;
  
  const [forwardingUser, setForwarndingUser] = useState([]);
  const [conversations, setConversations] = useState();
  //const id="678c9b26c1a5966a906b89b1"


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
  }, []);
  const checkClick = (user) => {
    if (
      forwardingUser.some((item) => item.reciever._id === user.reciever._id)
    ) {
      const updateUser = forwardingUser.filter(
        (item) => item.reciever._id !== user.reciever._id
      );
      setForwarndingUser(updateUser);
    } else {
      setForwarndingUser([...forwardingUser, user]);
    }
  };
  const forwardMessage = async () => {
    const temp = forwardingUser.filter(
      (item) => item.reciever._id !== chatWith._id
    );
    temp.map((user) => {
      axios
        .post(`${window.location.origin}/api/v1/message`, {
          conversationId: user.conversationId,
          senderId: loggedInUser?._id,
          message: message.message,
          messageType:message.messageType
        })
        .then((response) => {
        })
        .catch((error) => {
          console.log("sendmessage error", error);
        });
        

    });
    if (forwardingUser.some(state=>state.reciever._id===chatWith._id)) {
        forwardToChatOpenUser()
    }else{
        closeModal()
    }
  };
  const forwardToChatOpenUser=()=>{
    axios
        .post(`${window.location.origin}/api/v1/message`, {
          conversationId: conversationIdChatWith,
          senderId: loggedInUser?._id,
          message: message.message,
          messageType:message.messageType
        })
        .then((response) => {
          if (message?.messageType==="text") {
            socket?.emit("sendMessage", {
              messageId: response.data.data._id,
              conversationId: response.data.data?.conversationId,
              senderId: loggedInUser?._id,
              receiverId: chatWith._id,
              message: response.data.data.message,
            });
          }
          else{
            socket?.emit("sendFile", {
                messageId: response.data.data?._id,
                conversationId: response.data.data?.conversationId,
                senderId: response.data.data?.senderId,
                receiverId: chatWith._id,
                message: response.data.data.message,
              });
          }
        })
        .catch((error) => {
          console.log("sendmessage error", error);
        });
        closeModal()
  }
  return (
    <div className="w-full h-full">
      <div className="m-1">Forward to :</div>
      <div className="w-full h-[5vh]">
        {forwardingUser?.length > 0 ? (
          <div className="flex overflow-scroll scrollbar-hide">
            {forwardingUser.map((user) => {
              return (
                <span className="flex min-w-12 justify-center  h-[90%]  items-center ml-0.5 mr-0.5 rounded-xl p-1 bg-blue-300 text-black">
                  {user.reciever.username}
                </span>
              );
            })}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="h-[61vh] overflow-scroll  scrollbar-hide w-full">
        {conversations?.length > 0 ? (
          <div>
            {conversations?.map((reciever) => {
              return (
                <>
                  <div className="flex items-center m-3 ml-5 hover:bg-gray-700">
                    <input
                      type="checkbox"
                      className="w-6 h-6 m-1"
                      onChange={() => {
                        checkClick(reciever);
                      }}
                    />
                    <img
                      src={reciever.reciever.dp}
                      alt=""
                      className="w-16 h-16 rounded-full m-1"
                    />
                    <span className="m-1 text-xl">
                      {reciever.reciever.username}
                    </span>
                  </div>
                </>
              );
            })}
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="w-full h-[10vh]  mt-2 flex justify-center items-center">
        <div
          className={`w-[70%] h-[80%] border rounded-xl bg-blue-600  hover:bg-blue-700
            flex justify-center items-center text-3xl 
            ${
              forwardingUser.length > 0
                ? " cursor-pointer"
                : " cursor-not-allowed opacity-50"
            }`}
          onClick={() => {
            forwardMessage();
          }}
        >
          Forward
        </div>
      </div>
    </div>
  );
};

export default Forward;
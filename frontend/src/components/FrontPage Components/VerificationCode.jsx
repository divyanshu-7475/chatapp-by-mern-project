import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const VerificationCode = ({ userDetails, closeModal }) => {
  const [message, setMessage] = useState("");
  const inputRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return; // Allow only single-digit numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };
  useEffect(() => {
    setMessage("");
  }, [otp]);

  const submitClick = () => {
    let extracode = 0;
    for (let index = 0; index < otp.length; index++) {
      if (otp[index] === "") {
        index = 6;
      }
      extracode = extracode + Number(otp[index]) * Math.pow(10, 5 - index);
    }
    const code = extracode.toString();
    if (code.length < 6) {
      setMessage("code is incomplete!, please enter full code ");
    } else {
      axios
        .post(`${window.location.origin}/api/v1/users/register`, {
          username: userDetails?.userName,
          fullname: userDetails?.fullName,
          email: userDetails?.email,
          password: userDetails?.password,
          code:code
        })
        .then((res) => {
          setMessage("User registered successfully,now login");
          setTimeout(()=>{
            closeModal()
          },1000)
        })
        .catch((err) => {
          if (err?.status === 409) {
            setMessage("username or email already exist");
          }
        });
    }
  };
  const resend=()=>{
    
    axios.post(`${window.location.origin}/api/v1/email`,{
          email:userDetails?.email,
          context:"new"
      }).then((res)=>{
          
          setMessage("code sent to your email")
      }).catch((err)=>{
          setMessage("some thing went while  resending code")

      })
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center ">
      {message && (
        <div className="w-full flex justify-center text-red-600 text-xl">
          {message}
        </div>
      )}
      <div className="w-full flex justify-center">
        <div className="w-1/2 m-3 text-xl">Enter code here</div>
      </div>
      <div className="w-full h-3/5">
        <div className="w-full h-[70%] flex flex-col justify-center items-center ">
          <div className="pb-1.5 flex gap-3 w-1/2 h-[30%] border border-b-transparent justify-end items-end rounded-t-xl pl-3 pr-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-[17%] h-10 bg-transparent border rounded-md md:pl-2 text-lg"
              />
            ))}
          </div>
          <div className="w-1/2 h-[20%] border flex justify-end border-t-transparent border-b-transparent pb-2 pr-5 pt-1">
          <div className=" cursor-pointer text-blue-500 rounded-full hover:text-blue-700" onClick={resend}>resend code...</div></div>
          <div className="w-full h-2/5 flex justify-center">
            <div className="w-1/2 h-full border border-t-transparent rounded-b-xl flex justify-center">
              <div
                className="w-3/5 h-1/2 border rounded-xl bg-blue-600 text-3xl flex justify-center items-center cursor-pointer"
                onClick={submitClick}
              >
                Submit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { VerificationCode };

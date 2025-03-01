import React, { useEffect, useRef, useState } from 'react'
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop } from "react-image-crop"
import setCanvasPreview from './setCanvasPreview';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/user/user.Slice';
const Aspect_ratio=1
const Min_Dimension=150;

const ImageCropper=({closeModal,socket,useFor})=>{
  const chatWith=useSelector(state=>state.chatOpenUser)?.chatOpenUser
  const conversationId = useSelector((state) => state.conversationId)?.conversationId;
  const loggedInUser = useSelector((state) => state.userData)?.user;
  const dispatch=useDispatch()
  
  const imgRef=useRef(null)
  const previewCanvasRef=useRef(null)

  const [imageSource,setImageSource]=useState("")
  const [crop, setCrop] = useState()
  const [canvasWidth,setCanvasWidth]=useState(150)
  const [canvasHeight,setCanvasHeight]=useState(150)
  const [canvasImgSrc,setCanvasImgSrc]=useState('')
  const [option,setOption]=useState(false)
  const [file,setFile]=useState('')
  

  const canvasPreview=async()=>{
    const {file,previewUrl,dimensions}=await setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(crop,imgRef.current.width,imgRef.current.height)
    )
    setCanvasWidth(dimensions.width)
    setCanvasHeight(dimensions.height)
    
    setCanvasImgSrc(previewUrl)
    setFile(file)
    }

  const onSelectFile=(e)=>{
    const file=e.target.files?.[0];
    if (!file) {
      return
    }
    setFile(file)
    const reader=new FileReader();
    reader.addEventListener("load",()=>{
      const imageUrl=reader.result?.toString() || "";
       setImageSource(imageUrl)
    })
    reader.readAsDataURL(file);
  }

  const onImageLoad=(e)=>{
    setOption(true)
    
  }

  const handleCropClick = () => {
    setCanvasImgSrc('')
    if (!imgRef.current) return;

    const width = imgRef.current.width;
    const height = imgRef.current.height;

    const initialCrop = {
      unit: "%",
      width: 50, // Adjusted for better UI
      height: 50,
      x: 25,
      y: 25,
    };

    const centeredCrop = centerCrop(initialCrop, width, height);
    setCrop(centeredCrop);
  };

  const sendFile=async()=>{
    const formData=new FormData();
    formData.append('file',file)
    formData.append('conversationId',conversationId)
    formData.append('senderId',loggedInUser?._id)
    await axios.post(`${window.location.origin}/api/v1/message/file`,formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res)=>{
      socket?.emit("sendFile", {
        messageId: res.data.data?._id,
        conversationId: res.data.data?.conversationId,
        senderId: res.data.data?.senderId,
        receiverId: chatWith._id,
        message: res.data.data.message,
      });
    }).catch((err)=>{
      console.log("file err",err)
      
    })
    closeModal()
  }

  const updateDP=async()=>{
  const formData= new FormData()
  formData.append('dp',file)
  formData.append('userId',loggedInUser._id)
    await axios.post(`${window.location.origin}/api/v1/users/update/dp`,formData,{
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((res)=>{
      dispatch(loginUser(res.data.data))
    }).catch((err)=>{
      console.log("error",err)
    })
    closeModal()
  }


  useEffect(()=>{
    if (canvasImgSrc!=='') {
      setCrop('')
    }
  },[canvasImgSrc])

  return (
    <div>
      
      <label className='block mb-3 w-full'>
        <span className='sr-only'>choose photo</span>
        <input type="file"
        accept='image/*'
        onChange={onSelectFile}
        className='block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file: border-0
        file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600'
         />

      </label>
      <div className={`w-full flex justify-center ${option?'':"hidden"}`}>
      <div className='w-2/5 border rounded-2xl bg-blue-400 pt-1 flex justify-center '>
      <div className=' mb-2 cursor-pointer hover:bg-blue-500 h-10 w-2/5 pt-1.5 flex justify-center  rounded-3xl'
      onClick={()=>{handleCropClick()}}
      >
            <svg  xmlns="http://www.w3.org/2000/svg"  width="30"  height="30"  viewBox="0 0 24 24"  
            fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  
            stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-crop">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 5v10a1 1 0 0 0 1 1h10" />
              <path d="M5 8h10a1 1 0 0 1 1 1v10" /></svg>
      </div>
      {useFor==="send"?
      <div className=' mb-2 cursor-pointer hover:bg-blue-500 h-10 w-2/5 pt-1.5 flex justify-center  rounded-3xl'
      onClick={()=>{
        sendFile()
      }}
      >
      <svg  xmlns="http://www.w3.org/2000/svg"  width="30"  height="30"  viewBox="0 0 24 24"  fill="none"  
      stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
      class="icon icon-tabler icons-tabler-outline icon-tabler-send-2"><path stroke="none" d="M0 0h24v24H0z"
      fill="none"/><path d="M4.698 4.034l16.302 7.966l-16.302 7.966a.503 .503 0 0 1 -.546 -.124a.555 .555 
      0 0 1 -.12 -.568l2.468 -7.274l-2.468 -7.274a.555 .555 0 0 1 .12 -.568a.503 .503 0 0 1 .546 -.124z" />
      <path d="M6.5 12h14.5" /></svg>
      </div>:
      <div className=' mb-2 cursor-pointer hover:bg-blue-500 h-10 w-2/5 pt-1.5 flex justify-center  rounded-3xl'
      onClick={()=>{
        updateDP()
      }}
      >
      <svg  xmlns="http://www.w3.org/2000/svg"  width="30"  height="30"  viewBox="0 0 24 24"  fill="none"  
      stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon 
      icon-tabler icons-tabler-outline icon-tabler-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M5 12l5 5l10 -10" /></svg>
      </div>
      }
      </div>
      </div>
      {
        imageSource && <div className='flex flex-col items-center'>
          <ReactCrop 
          crop={crop}
          onChange={(pixelCrop,percentCrop) => setCrop(percentCrop)}
          keepSelection
           >
           <img ref={imgRef} src={canvasImgSrc!==''?canvasImgSrc:imageSource} alt="upload"
           style={{maxHeight:"70vh"}}
           onLoad={onImageLoad}
            />
            </ReactCrop>
            <button className='text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 
            bg-sky-500 hover:bg-sky-600'
            onClick={()=>{
              canvasPreview()
            }}
            >
              Crop
            </button>
        </div>
      }

      {crop && 
      <canvas 
      ref={previewCanvasRef}
      className='mt-4  hidden'
      style={{
        border:"1px solid black",
        objectFit:"contain",
        width:canvasWidth,
        height:canvasHeight,
      }}
      />
    }
    </div>
  )
}

export default ImageCropper
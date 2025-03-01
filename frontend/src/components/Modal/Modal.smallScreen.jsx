import React from 'react'
import Forward from '../Forward.jsx'
import { PasswaordChange } from '../User/PasswaordChange.jsx'

 const ModalSmallScreen=({closeModal,socket,message,useFor})=>{    
  return (
    <div 
    className='relative z-10'
    aria-labelledby=" crop-image-dialog"
    role='dialog'
    aria-modal="true"
    >
        <div className='fixed inset-0 bg-gray-900 bg-opacity-75 translate-all backdrop-blur-sm'></div>
        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
            <div className='flex min-h-full justify-center px-2 py-12 text-center'>
                <div className={`relative   min-h-[60vh] rounded-2xl bg-gray-800
                text-slate-100 text-left shadow-xl translate-all sm:w-[50%] md:w-[30%] w-[90%] `}>
                    <div className='px-5 py-4'>
                        <button
                        type='button'
                        className='rounded-md p-1 inline-flex items-center justify-center text-gray-400 
                        hover:bg-gray-700 focus:outline-none absolute top-2 right-2'
                        onClick={closeModal}
                        >
                            <span className='sr-only'>close Menu</span>
                            <div>
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  
                            fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  
                            class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" 
                            fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                            </div>
                        </button>
                    </div>
                    {message && <Forward closeModal={closeModal} socket={socket} message={message} />}
                    {useFor==="change" && <PasswaordChange/> }
                </div>
            </div>
        </div>
    </div>
  )
}
export default ModalSmallScreen
'use client'
import React from 'react'

const Login = () => {
  return (
    <div className="flex h-screen w-screen bg-slate-50">
        <div className='bg-slate-50 w-screen flex flex-col log-in-page'>
          <div className='flex justify-between w-1/4 text-[#435A7F]'>
            <h1 className='log-in-mode cursor-pointer'>Log In</h1>
            <h1 className='idle-mode cursor-pointer'>Sign Up</h1>
          </div>


          <div className='m-5 w-1/2'>
            <div className='flex flex-col m-5'>
              <label className='font-semibold my-1'>Email</label>
              <input type='email' placeholder='Enter Email' className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            </div>
            
            <div className='flex flex-col m-5'>
              <label className='font-semibold my-1'>Password</label> 
              <input type='password' placeholder='Enter Password' className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
              <a href='#' className='flex flex-row-reverse text-sm py-1.5 font-semibold'>
                Forgot password?
              </a>
            </div>
          </div>

          <div className='flex flex-row-reverse w-1/2'>
            <button
              className='bg-[#00687B] h-[45px] w-1/4 rounded-[15px]
                text-white font-semibold'>
              Log In
            </button>
          </div>
        </div>


        <div className='bg-[#00687B] w-screen'>
          <div className='h-screen flex flex-col justify-center items-center'>
            <img src="schoolLogo.png" className='w-1/2' />
            <label>OneCIT</label>
            <label>Explore. Connect. Succeed.</label>
          </div>
        </div>
    </div>
  )
}

export default Login

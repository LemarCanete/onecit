'use client'
import React from 'react'
import Navbar from '@/components/Navbar'

const page = () => {
  return (
    <div className='w-full h-screen flex bg-neutral-100'>
      <Navbar/>
      <div className='grow px-10 py-5'>
        <h1 className="text-2xl">Template</h1>
        {/*insert code here */}
      </div>
    </div>
  )
}

export default page

'use client'
import React from 'react'
import Navbar from '@/components/Navbar'

const page = () => {
  return (
    <div className={`w-full h-screen flex bg-neutral-100`}>
      <Navbar/>
      <div>
        Inquiries here...
      </div>
    </div>
  )
}

export default page

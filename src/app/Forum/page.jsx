'use client'
import React from 'react'
import Navbar from '@/components/Navbar'

const page = () => {
    return (
        <div className={`w-full h-screen flex bg-neutral-50`}>
            <Navbar active="Dashboard"/>
            <div className="grow px-10 py-5">
                <h1 className="">Forum</h1>
            </div>
        </div>
    )
}

export default page
'use client'
import React from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'

const page = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-100'>
            <NavbarIconsOnly/>
            <div className='grow px-10 py-5'>
                <h1 className="text-2xl">Campus Security</h1>
                <div className="text-sm">
                    <p>Emergency Contact</p>
                    <p>Anonymous Reporting System</p>
                    <p>Safety Tips and Resources</p>
                    <p>Campus State Policies</p>
                    <p>Safety Maps</p>
                </div>
            </div>
        </div>
    )
}

export default page

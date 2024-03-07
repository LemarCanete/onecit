'use client'
import React from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'

const page = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-100'>
            <NavbarIconsOnly/>
            <div className='"grow px-10 py-5'>
                <h1 className="text-2xl">Rental</h1>

            </div>
        </div>
    )
}


export default page

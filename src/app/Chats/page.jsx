'use client'
import React from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import Chats from './Chats';

const page = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-100 gap-1'>
            <NavbarIconsOnly/>
            <Chats />
        </div>
    )
}

export default page

'use client'
import React from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import ChatsSection from './ChatsSection';

const Chats = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-100 gap-1'>
            <NavbarIconsOnly/>
            <ChatsSection />
        </div>
    )
}

export default Chats

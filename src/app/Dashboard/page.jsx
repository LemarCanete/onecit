'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile'
import Top from '@/components/Top'
import { useSelector } from 'react-redux'

const page = () => {
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    return (
        <div className={`w-full h-screen flex ${mode ? 'bg-slate-800' : 'bg-neutral-100'}`}>
            <Navbar active="Dashboard"/>
            <div className="grow px-10 py-5">
                <Top />
            </div>
            {profile && <Profile />}
        </div>
    )
}

export default page
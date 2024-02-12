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
        <div className={`w-full  h-screen flex ${mode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <Navbar />
            <div className="grow">
                <div className="bg-white w-2/12 h-full border-s py-5">
                    <h1 className="border-b">Messages</h1>
                </div>
            </div>
        </div>
    )
}

export default page
'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

const page = () => {
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    return (
        <div className={`w-full  h-screen flex ${mode ? 'bg-slate-800' : 'bg-neutral-50'}`}>
            <Navbar active="Apps"/>
            <div className="grow px-10 py-5">
                
                {/* Content */}
                <div className="flex">
                    <div className="w-5/6 grid grid-cols-6 mt-10 ">
                        <Box name="Directory"/>
                        <Box name="Services"/>
                        <Box name="Library"/>
                        <Box name="Personal Details"/>
                        <Box name="Chat"/>
                        <Box name="Task Management"/>
                        <Box name="Announcements"/>
                        <Box name="Calendar of Events"/>
                        <Box name="Forum"/>
                        <Box name="Feedback and Complaints"/>
                        <Box name="Careers"/>
                        <Box name="Grade Calculator"/>
                        <Box name="Class Tracker"/>
                        <Box name="Courses"/>
                    </div>

                    <div className="rows-span-5 bg-white h-full">
                        <p className=''>Quick Links</p>
                    </div>
                </div>
                

            </div>
            {profile && <Profile />}
        </div>
    )
}

const Box = ({image, name}) =>{
    const router = useRouter()

    return (
        <div className="flex justify-center flex-col border rounded-lg w-40 h-36 items-center m-2 bg-white cursor-pointer text-center" onClick={() => router.push(`/${name}`)}>
            <img src="schoolLogo.png" alt="" className='w-20 h-20'/>
            <p className='text-sm m-1'>{name}</p>
        </div>
    )
}

export default page
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
                <h1 className="text-2xl my-5">Apps</h1>
                {/* Content */}
                <div className="flex">
                    <div className="w-5/6">
                        <p className="text-sm italic text-black/25">Done or Working</p>
                        <div className="w-full grid grid-cols-6 ">
                            <Box name="Services"/>
                            <Box name="Library"/>
                            <Box name="Chat"/>
                            <Box name="Calendar of Events"/>
                            <Box name="Announcements"/>
                            <Box name="Forum"/>
                            <Box name="Feedback and Complaints"/>
                        </div>
                        <p className="text-sm italic text-black/25">Not started</p>
                        <div className="w-full grid grid-cols-6">
                            <Box name="Directory"/>
                            <Box name="Personal Details"/>
                            <Box name="Task Management"/>
                            <Box name="Careers"/>
                            <Box name="Grade Calculator"/>
                            <Box name="Class Tracker"/>
                            <Box name="Courses"/>
                            <Box name="Campus Map"/>
                        </div>
                    </div>

                    <div class="quicklink-background">
                        <div class="quick-container">
                            <ul>
                                <p class="quick-links">Quick Links:</p>
                                <li><a href="https://cit.edu/">CIT-U Official Website</a></li><hr/>
                                <li><a href="https://www.facebook.com/CITUniversity">CIT-U Facebook Page</a></li><hr/>
                                <li><a href="https://cituweb.pinnacle.com.ph/aims/students/">Student Access Module &#40;AIMS&#41;</a></li><hr/>
                                <li><a href="https://lair.education/">Wild Cats Lair</a></li>

                            </ul>
                        </div>
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
        <div className="flex justify-center flex-col border rounded-lg w-40 h-36 items-center m-2 bg-white cursor-pointer text-center" onClick={() => router.push(`/${name.replaceAll(/\s+/g, '')}`)}>
            <img src="schoolLogo.png" alt="" className='w-20 h-20'/>
            <p className='text-sm m-1'>{name}</p>
        </div>
    )
}

export default page
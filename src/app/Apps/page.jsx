'use client'
import React, { useContext, useState } from 'react'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import Top from '@/components/Top'


const userApps = [
    {
        name: "Services",
        isDone: true,
    },
    {
        name: "Library",
        isDone: true,
    },
    {
        name: "Chats",
        isDone: true,
    },
    {
        name: "Calendar of Events",
        isDone: true,
    },
    {
        name: "Directory",
        isDone: true,
    },
    {
        name: "Announcements",
        isDone: true,
    },
    {
        name: "Forum",
        isDone: true,
    },
    {
        name: "Feedback and Complaints",
        isDone: true,
    },
    {
        name: "Settings",
        isDone: true,
    },
    {
        name: "Task Management",
        isDone: true,
    },
    {
        name: "Careers",
        isDone: true,
    },
    {
        name: "Grade Calculator",
        isDone: false,
    },
    {
        name: "Class Tracker",
        isDone: false,
    },
    {
        name: "Courses",
        isDone: false,
    },
    {
        name: "Campus Map",
        isDone: false,
    },
    
]

const adminApps = [
    {
        name: "Services",
        isDone: true,
    },
    {
        name: "Library",
        isDone: true,
    },
    {
        name: "Chats",
        isDone: true,
    },
    {
        name: "Calendar of Events",
        isDone: true,
    },
    {
        name: "User Management",
        isDone: true,
    },
    {
        name: "Directory",
        isDone: true,
    },
    {
        name: "Settings",
        isDone: true,
    },
]

const page = () => {
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    const {currentUser} = useContext(AuthContext);

    const isAdmin = currentUser.role === "admin"
    
    const renderDoneApps = () =>{
        if(isAdmin){
            return adminApps.map((app)=>{
                return app.isDone && <Box name={app.name} mode={mode}/>
            })
        }else{
            return userApps.map((app)=>{
                return app.isDone && <Box name={app.name} mode={mode}/>
            })
        }
    }
    const renderNotStartedApps = () =>{
        if(isAdmin){
            return adminApps.map((app)=>{
                return !app.isDone && <Box name={app.name} mode={mode}/>
            })
        }else{
            return userApps.map((app)=>{
                return !app.isDone && <Box name={app.name} mode={mode}/>
            })
        }
    }

    return (
        <div className={`w-full  h-screen flex ${mode ? 'bg-slate-800' : 'bg-neutral-50'}`}>
            <Navbar active="Apps"/>
            <div className="grow px-10 py-5">
                <Top />
                <h1 className="text-2xl my-3">Apps</h1>
                {/* Content */}
                <div className="flex">
                    <div className="w-full">
                        {/* <p className="text-sm italic text-black/25">Done or Working</p> */}
                        <div className={`w-full grid grid-cols-${profile ? '4' : '6'}`}>
                            {currentUser.role && renderDoneApps()}
                        </div>
                        <p className="text-sm italic text-black/25">Not Started</p>
                        <div className={`w-full grid grid-cols-${profile ? '4' : '6'}`}>
                            {currentUser.role && renderNotStartedApps()}
                        </div>
                    </div>

                    <div className={`quicklink-background ${mode ? 'bg-slate-600 text-white border-none' : 'bg-white'}`}>
                        <div className="quick-container">
                            <ul>
                                <p className="quick-links">Quick Links:</p>
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

const Box = ({image, name, mode}) =>{
    const router = useRouter()

    return (
        <div className={`flex justify-center flex-col rounded-lg w-40 h-36 items-center m-2 cursor-pointer text-center ${mode ? 'bg-slate-600 text-white border-none': 'bg-white border'}`} onClick={() => router.push(`/${name.replaceAll(/\s+/g, '')}`)}>
            <img src="./schoolLogo.png" alt="" className='w-20 h-20'/>
            <p className='text-sm m-1'>{name}</p>
        </div>
    )
}

export default page
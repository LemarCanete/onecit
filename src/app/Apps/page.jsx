'use client'
import React, { useContext, useState } from 'react'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/context/AuthContext'
import Top from '@/components/Top'
import { IoLibrarySharp, IoCalendarSharp, IoChatboxSharp, IoSettings, IoMap, IoMapSharp, IoBuild, IoCalculatorSharp, IoListCircleSharp, IoMegaphoneSharp, IoBookSharp, IoTimeSharp, IoCreateSharp, IoAlertCircleSharp  } from "react-icons/io5";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { BiSolidHardHat } from 'react-icons/bi'
import { MdManageAccounts } from "react-icons/md";
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import { GiRoundTable } from "react-icons/gi";
import { IoIosBulb } from "react-icons/io";
import { VscFeedback } from "react-icons/vsc";


const userApps = [
    {
        name: "Settings",
        isDone: true,
        image: './schoolLogo.png',
        icon: <IoSettings />
    },
    {
        name: "Directory",
        isDone: true,
        image: './Icons/Apps-Directory.png',
        icon: <VscTypeHierarchySub />
    },
    {
        name: "Calendar of Events",
        isDone: true,
        image: './Icons/Apps-Calendar_Events.png',
        icon: <IoCalendarSharp />
    },
    {
        name: "Library",
        isDone: true,
        image: './Icons/Apps-Library.png',
        icon: <IoLibrarySharp />
    },
    {
        name: "Chats",
        isDone: true,
        image: './Icons/Apps-Chat.png',
        icon: <IoChatboxSharp />
    },
    {
        name: "Appointments",
        isDone: true,
        image: '',
        icon: <GiRoundTable />
    },
    {
        name: "Announcements",
        isDone: true,
        image: './Icons/Apps-Announcement.png',
        icon: <IoMegaphoneSharp />
    },
    {
        name: "Forum",
        isDone: true,
        image: './Icons/Apps-Forums.png',
        icon: <IoCreateSharp />
    },
    {
        name: "Class Tracker",
        isDone: true,
        image: './Icons/Apps-Class_Tracker.png',
        icon: <IoTimeSharp />
    },
    {
        name: "Inquiry",
        isDone: true,
        image: './schoolLogo.png',
        icon: <IoIosBulb />
    },
    {
        name: "Task Management",
        isDone: true,
        image: './Icons/Apps-Task_Management.png',
        icon: <IoListCircleSharp />
    },
    {
        name: "Feedback and Complaints",
        isDone: true,
        image: './Icons/Apps-Feedback_and_Complaints.png',
        icon: <IoAlertCircleSharp />
    },
    
    // {
    //     name: "Careers",
    //     isDone: false,
    //     image: './Icons/Apps-Careers.png',
    //     icon: <BiSolidHardHat />
    // },
    // {
    //     name: "Grade Calculator",
    //     isDone: false,
    //     image: './Icons/Apps-Grade_Calculator.png',
    //     icon: <IoCalculatorSharp />
    // },
    // {
    //     name: "Courses",
    //     isDone: false,
    //     image: './Icons/Apps-Courses.png',
    //     icon: <IoBookSharp />
    // },
    // {
    //     name: "Campus Map",
    //     isDone: false,
    //     image: './schoolLogo.png',
    //     icon: <IoMapSharp />
    // },
    
]

const adminApps = [
    {
        name: "Inquiry",
        isDone: true,
        image: './schoolLogo.png',
        icon: <IoIosBulb />
    },
    {
        name: "Settings",
        isDone: true,
        image: './schoolLogo.png',
        icon: <IoSettings />
    },
    {
        name: "Appointments",
        isDone: true,
        image: '',
        icon: <GiRoundTable />
    },
    {
        name: "Calendar of Events",
        isDone: true,
        image: './Icons/Apps-Calendar_Events.png',
        icon: <IoCalendarSharp />
    },
    {
        name: "User Management",
        isDone: true,
        image: "./schoolLogo.png",
        icon: <MdManageAccounts />
    },
    {
        name: "Feedback and Complaints",
        isDone: true,
        image: "./schoolLogo.png",
        icon: <VscFeedback />
    },
    {
        name: "Forum",
        isDone: true,
        image: "./schoolLogo.png",
        icon: <VscFeedback />
    },
    // {
    //     name: "Library",
    //     isDone: true,
    //     image: './Icons/Apps-Library.png',
    //     icon: <IoLibrarySharp />
    // },
    // {
    //     name: "Chats",
    //     isDone: true,
    //     image: './Icons/Apps-Chat.png',
    //     icon: <IoChatboxSharp />
    // },
    // {
    //     name: "Directory",
    //     isDone: true,
    //     image: './Icons/Apps-Directory.png',
    //     icon: <VscTypeHierarchySub />
    // },
    
]

const Apps = () => {
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    const {currentUser} = useContext(AuthContext);

    const isAdmin = currentUser.role === "admin"
    
    const renderDoneApps = () =>{
        if(isAdmin){
            return adminApps.map((app)=>{
                return app.isDone && <Box name={app.name} mode={mode} image={app.image} icon={app.icon}/>
            })
        }else{
            return userApps.map((app)=>{
                return app.isDone && <Box name={app.name} mode={mode} image={app.image} icon={app.icon}/>
            })
        }
    }
    const renderNotStartedApps = () =>{
        if(isAdmin){
            return adminApps.map((app)=>{
                return !app.isDone && <Box name={app.name} mode={mode} image={app.image} icon={app.icon}/>
            })
        }else{
            return userApps.map((app)=>{
                return !app.isDone && <Box name={app.name} mode={mode} image={app.image} icon={app.icon}/>
            })
        }
    }

    return (
        <div className={`w-full  h-screen flex ${mode ? 'bg-slate-800' : 'bg-neutral-50'}`}>
            
            {profile ? <NavbarIconsOnly active="Apps"/> : <Navbar active="Apps"/>}

            <div className={`grow py-5 ${profile ? 'px-16' : 'px-10'}`}>
                <div className="w-full flex justify-between items-center">
                    {/* <input type="search" className='grow rounded-lg p-2 ps-5 border-b outline-none' placeholder='Search'/> */}
                    <h1 className={`text-xl font-bold my-3 tracking-wider ${mode && 'text-white'}`}>Apps</h1>
                    <Top />
                </div>
                {/* Content */}
                <div className="flex gap-2">
                    <div className="w-10/12">
                        {/* <p className="text-sm italic text-black/25">Done or Working</p> */}
                        <div className={`w-full grid grid-cols-${profile ? '4' : '6'}`}>
                            {currentUser.role && renderDoneApps()}
                        </div>
                        {/* <p className="text-sm italic text-black/25">Unfinished</p>
                        <div className={`w-full grid grid-cols-${profile ? '4' : '6'}`}>
                            {currentUser.role && renderNotStartedApps()}
                        </div> */}
                    </div>

                    <div className={`grow quicklink-background ${mode ? 'bg-slate-600 text-white border-none' : 'bg-white'}`}>
                        <div className="quick-container">
                            <ul>
                                <p className="quick-links">Quick Links:</p>
                                <li><a href="https://cit.edu/" target='_blank'>CIT-U Official Website</a></li><hr/>
                                <li><a href="https://www.facebook.com/CITUniversity" target='_blank'>CIT-U Facebook Page</a></li><hr/>
                                <li><a href="https://cituweb.pinnacle.com.ph/aims/students/" target='_blank'>Student Access Module &#40;AIMS&#41;</a></li><hr/>
                                <li><a href="https://lair.education/" target='_blank'>Wild Cats Lair</a></li>

                            </ul>
                        </div>
                    </div>
                </div>
                

            </div>
            {profile && <Profile />}
        </div>
    )
}

const Box = ({image, name, mode, icon}) =>{
    const router = useRouter()

    return (
        <div className={`flex justify-center flex-col rounded-lg w-40 h-36 items-center m-2 cursor-pointer text-center gap-2 ${mode ? 'bg-slate-600 text-white border-none': 'bg-white border'}`} onClick={() => router.push(`/${name.replaceAll(/\s+/g, '')}`)}>
            {/* <img src={image} alt="" className='w-20 h-20'/> */}
            <p className={`text-5xl ${mode ? 'text-teal-500' : 'text-teal-800'}`}>{icon}</p>
            <p className='text-sm m-1'>{name}</p>
        </div>
    )
}

export default Apps
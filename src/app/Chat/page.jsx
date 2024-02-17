'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile'
import { useSelector } from 'react-redux'

const page = () => {
    const users = [
        {
            name: "Lemar Canete",
            chat: "Hello",
        },
        {
            name: "Lemar Canete",
            chat: "Hi",
        },
        {
            name: "Lemar Canete",
            chat: "hehe",
        },
        {
            name: "Lemar Canete",
            chat: "hihi",
        },
        {
            name: "Lemar Canete",
            chat: "huhu",
        },
    ]
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    return (
        <div className={`w-full  h-screen flex ${mode ? 'bg-slate-800' : 'bg-neutral-50'}`}>
            <Navbar active="Chat"/>
            <div className="grow flex">

                <div className="bg-white w-2/12 h-full  ms-2">
                    <h1 className="p-3">Messages (12)</h1>
                    <hr />
                    <div className="">
                        {users.map((user, id) => (
                            <div className="grid grid-flow-col grid-rows-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer">
                                <img src="schoolLogo.png" alt="" className='row-span-2 h-12 w-12'/>
                                <p className="font-bold text-small">{user.name}</p>
                                <p className="">{user.chat}</p>
                            </div>
                        ))}
                    </div>


                </div>
                <div className="grow ">
                    <div className="border">
                        <p className='bg-white p-2'>Lemar Canete</p>
                    </div>
                </div>
                {/* team members */}
                <div className="w-2/12 bg-white h-full">
                    <p>Team Members</p>
                </div>
            </div>
            
        </div>
    )
}

export default page
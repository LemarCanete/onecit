'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile'
import { useSelector } from 'react-redux'
import { BiSend } from 'react-icons/bi'

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

                <div className="bg-white w-3/12 h-full  ms-2">
                    <h1 className="p-3">Messages (12)</h1>
                    <hr />
                    <div className="">
                        {users.map((user, id) => (
                            <div className="grid grid-flow-col grid-rows-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer">
                                <img src="schoolLogo.png" alt="" className='row-span-2 h-12 w-12'/>
                                <p className="font-bold text-sm">{user.name}</p>
                                <p className="col-span-6 text-sm">{user.chat}</p>
                            </div>
                        ))}
                    </div>


                </div>
                <div className="grow flex justify-between flex-col">
                    <div className="border flex bg-white p-2">
                        <p className='mx-2'>Lemar Canete</p>
                        <p className='mx-2 font-bold cursor-pointer'>Chat</p>
                        <p className='mx-2 cursor-pointer'>Files</p>
                    </div>
                    <div className="px-16 rounded ">
                        <input type="text" placeholder='Type a message...' className='w-full border p-2 mb-16 text-sm'/>
                    </div>
                </div>
                {/* team members */}
                {/* <div className="w-2/12 bg-white h-full">
                    <p>Team Members</p>
                </div> */}
            </div>
            
        </div>
    )
}

export default page
'use client'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Navbar from '@/components/Navbar'
import { BiSend } from 'react-icons/bi'

const URL = 'http://localhost:4000'
const socket = io(URL)

const page = () => {
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setChatMessages((prevMessages) => [...prevMessages, data]);
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    //function to send message
    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('sendMessage', { user: 'Lemar Canete', message });
            setMessage('');
        }
    };

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
    return (
        <div className='w-full  h-screen flex bg-neutral-100'>
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
                        {/* Display messages */}
                    <div className="px-16 rounded ">
                        {chatMessages.map((msg, index) => (
                            <div key={index} className="mb-2">
                            <p className="text-sm font-bold">{msg.user}</p>
                            <p className="text-sm">{msg.message}</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-16 rounded ">
                        <input type="text" placeholder='Type a message...' className='w-full border p-2 mb-16 text-sm' value={message} onChange={(e)=> setMessage(e.target.value)}/>
                        <button onClick={sendMessage} className='border-0'>Send</button>
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
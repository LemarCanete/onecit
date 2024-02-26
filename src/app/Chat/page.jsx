'use client'
import React, { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Navbar from '@/components/Navbar'
import { BiSend } from 'react-icons/bi'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {collection, doc, query, setDoc, where, getDocs} from 'firebase/firestore'
import { db } from '@/firebase-config'

const URL = 'http://localhost:4000'
const socket = io(URL)

const page = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [message, setMessage] = useState('')
    const [chatMessages, setChatMessages] = useState([])
    const [allChats, setAllChats] = useState([])
    useEffect(() => {
        socket.on('receiveMessage', (data) => {
            setChatMessages((prevMessages) => [...prevMessages, data]);
        });
        return () => {
            socket.off('receiveMessage');
        };
    }, []);

    useEffect(()=>{
        const fetchData = async() =>{
            try{
                const q = query(collection(db, 'users'))
                let querySnapshot = await getDocs(q);

                const AllUsersResults = querySnapshot.docs.map((doc, id) => {
                    const { uid, ...rest } = doc.data();
                    return { uid, ...rest };
                });
                
                setAllUsers(AllUsersResults)
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [])

    //function to send message
    const sendMessage = () => {
        if (message.trim() !== '') {
            socket.emit('sendMessage', { user: currentChat, message });
            setMessage('');
        }
    };
    console.log(allUsers)
    const handleOnSearch = (string, results) => {
        console.log(string, results)
    }
    const handleOnSelect = (item) => {
        console.log(item)
        setAllChats(prev => [{name: `${item.firstname} ${item.lastname}`}, ...prev])
    }   
    const formatResult = (item) => {
        return (
          <>
            {/* <span className="block text-left" >id: {item.id}</span> */}
            <span className="block text-left">{item.firstname} {item.lastname}</span>
            <span className='block text-left'>{item.schoolid} | {item.email}</span>
          </>
        )
    }

    return (
        <div className='w-full  h-screen flex bg-neutral-100'>
            <Navbar active="Chat"/>
            <div className="grow flex">
                <div className="bg-white w-3/12 h-full  ms-2">
                    <h1 className="p-3">Messages (12)</h1>
                    <hr />
                    <ReactSearchAutocomplete items={allUsers}
                        onSearch={handleOnSearch}
                        onSelect={handleOnSelect}
                        autoFocus
                        formatResult={formatResult}
                        fuseOptions={{keys: ['firstname', "lastname", "email", "schoolid"], threshold: 0.2}}
                        styling={{ fontSize: "14px", border: "0 0 1px 0 solid #dfe1e5", borderRadius: "0px",  boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 0px 0px"}} 
                        resultStringKeyName="schoolid"/>
                    <div className="">
                        {allChats.map((user, id) => (
                            <div className="grid grid-flow-col grid-rows-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer" >
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
'use client'
import { ChatContext } from '@/context/ChatContext'
import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import {doc, onSnapshot} from 'firebase/firestore'
import { db } from '@/firebase-config'


const Messages = () => {
    const [messages, setMessages] = useState([])
    const {data} = useContext(ChatContext)
    
    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
            doc.exists() && setMessages(doc.data().messages);
        });

        return () =>{
            unSub()
        }

    }, [data.chatId])

    console.log(messages)

    return (
        <div className='px-16 mb-6 rounded flex flex-col overflow-y-scroll grow'>
            {messages.map(msg => (
                <Message message={msg} key={msg.id}/>
            ))}
        </div>
    )
}

export default Messages
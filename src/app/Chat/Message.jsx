'use client'
import { AuthContext } from '@/context/AuthContext';
import { ChatContext } from '@/context/ChatContext';
import React, { useContext, useEffect, useRef } from 'react'
import { useCookies } from 'react-cookie';

const Message = ({message}) => {
    const [cookies] = useCookies(['id']);
    const userId = cookies['id'];
    const { currentUser } = useContext(AuthContext);
    const {data} = useContext(ChatContext)
    
    const ref = useRef();

    useEffect(() => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    }, [message]);

    const formattedDate = message.date
    ? new Date(message.date.seconds * 1000 + message.date.nanoseconds / 1000000).toLocaleString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })
    : '';

    console.log(currentUser.uid, userId)
    console.log(message)
    console.log(data)
    return (
        <div className={`mb-2 ${message.senderId === currentUser.uid ? 'ml-auto bg-white p-3 rounded-lg' : 'mr-auto '}`} ref={ref}>
            <p className="text-sm font-bold">
                {message.senderId === currentUser.uid
                ? `${currentUser.firstname} ${currentUser.lastname} (You)`
                : `${data.user.displayName}`}
            </p>
            <p className="text-sm">{message.message}</p>
            {message.img && <img src={message.img} alt="" /> }
            <p className="text-xs text-gray-500 ">{formattedDate}</p>
        </div>
    )
}

export default Message
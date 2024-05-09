import { db } from '@/firebase-config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { BsCircle, BsCircleFill } from 'react-icons/bs'

const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else {
      return `${minutes} minutes ago`;
    }
}

const Notification = ({notifications}) => {
    const [notificationLists, setNotificationLists] = useState(notifications)
    const [isUnread, setIsUnread] = useState(false)
    
    const clicked = 'bg-teal-500 text-white '

    return (
        <div className='overflow-scroll-y m-2'>
            <div className="ms-3">
                <h1 className="text-lg mb-2">Notifications</h1>
                <div className="flex text-sm ">
                    <button className={`rounded-2xl py-1 px-8 ${!isUnread && clicked}`} onClick={()=>{
                        setIsUnread(false);
                        setNotificationLists(notifications)
                    }}>All</button>
                    <button className={`rounded-2xl py-1 px-8 ${isUnread && clicked}`} onClick={()=> {
                        setNotificationLists(notifications.filter(notification => !notification.isRead))
                        setIsUnread(true);
                    }}>Unread</button>
                </div>
            </div>
            <hr className='mt-3 mb-2 mx-4'/>
            <div className="">
                {notificationLists.length > 0 && notificationLists.sort((a, b) => b.date - a.date).map((notification, key) =>{
                    return <NotificationBox details={notification} key={key}/>
                })}
            </div>
        </div>
    )
}

const NotificationBox = ({details}) =>{
    const router = useRouter()
    const {senderName, senderMessage, date, link, isRead, senderUid, id} = details;
    const [senderPic, setSenderPic] = useState('/schoolLogo.png')

    const getPhoto = async() =>{
        const docRef = doc(db, "users", senderUid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setSenderPic(docSnap.data()?.photoURL || '/schoolLogo.png')
        }
    }
    getPhoto()
    console.log(details)

    const handleClick = async() => {
        const notificationRef = doc(db, "notifications", id);
        await updateDoc(notificationRef, {
            isRead: true
        });
        router.push(link)
    }

    return(
        <div className={`grid grid-cols-10 py-2 text-sm hover:bg-neutral-200 cursor-pointer rounded px-3 ${isRead && 'text-neutral-500'}`} onClick={handleClick}>
            <img src={senderPic} alt="" className='col-span-2'/>
            <div className="col-span-7 flex flex-col justify-between ms-2 tracking-wide">
                <p className="">
                    <span className="font-bold">{senderName} </span>
                    {senderMessage}
                </p>
                <span className='text-teal-700'>{formatDate(date)}</span>
            </div>
            {!isRead && <BsCircleFill className='text-teal-700 my-auto text-right w-full'/>}
        </div>
    )
}

export default Notification
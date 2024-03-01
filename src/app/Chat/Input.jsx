'use client'
import React, { useContext, useState } from 'react'
import { useCookies } from 'react-cookie';
import {BsPaperclip, BsSend, BsSendFill} from 'react-icons/bs'
import { ChatContext } from '@/context/ChatContext';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc} from "firebase/firestore";
import {v4 as uuid} from "uuid"
import { db, storage } from '@/firebase-config';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from '@/context/AuthContext';

const Input = () => {
    const [img, setImg] = useState()
    const [message, setMessage] = useState('')
    const [cookies] = useCookies(['id']);
    const userId = cookies['id'];

    const {currentUser} = useContext(AuthContext)
    const {data} = useContext(ChatContext)

    console.log(data)
    //function to send message
    const handleSend = async() => {
        if(img){
            const storageRef = ref(storage, uuid())
            const uploadTask = uploadBytesResumable(storageRef, img)

            uploadTask.on(
                (error) => {
                    console.log(error)
                    // setErr(true)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        await updateDoc(doc(db, "chats", data.chatId), {
                            messages: arrayUnion({
                                id: uuid(),
                                message,
                                senderId: userId,
                                date: Timestamp.now(),
                                img: downloadURL,
                              }),
                        })
                    })
                }
            )

        }else{
            await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                    id: uuid(),
                    message,
                    senderId: userId,
                    date: Timestamp.now(),
                  }),
            })
        }

        await updateDoc(doc(db, "userChats", currentUser.uid), {
            [data.chatId + ".lastMessage"]: {
              message,
            },
            [data.chatId + ".date"]: serverTimestamp(),
          });
      
          await updateDoc(doc(db, "userChats", data.user.uid), {
            [data.chatId + ".lastMessage"]: {
              message,
            },
            [data.chatId + ".date"]: serverTimestamp(),
          });

        setMessage("");
        setImg(null)
    };
    console.log(img)
    return (
        <div className="px-16 rounded flex mb-16">
            <input type="text" placeholder='Type a message...' className='w-full border p-2 text-sm rounded' value={(img) ? img.name : message} onChange={(e)=> setMessage(e.target.value)}/>
            <input type="file" className='hidden' id='file' onChange={e=>setImg(e.target.files[0])}/>
            <label htmlFor="file">
                <BsPaperclip className='text-3xl cursor-pointer' />
            </label>
            <button onClick={handleSend} className='border-0 text-3xl'><BsSendFill color='darkBlue'/></button>
        </div>
    )
}

export default Input
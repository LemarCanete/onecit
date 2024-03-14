'use client'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '@/context/AuthContext'
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { Timestamp, query, collection, where, onSnapshot, setDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { v4 as uuid } from 'uuid';

const Message = ({setIsOpen, message}) => {
    const {currentUser} = useContext(AuthContext);
    const [response, setResponse] = useState('')
    const [convo, setConvo] = useState([])

    useEffect(() => {
      if (currentUser && currentUser.uid && message) { // Check if message exists
        const queryConvo = query(
          collection(db, "inquiries"),
          where('inquiryid', '==', message.id),
        );
    
        const unsubscribe = onSnapshot(queryConvo, (querySnapshot) => {
          const retrievedConvo = [];
          querySnapshot.forEach((doc) => {
            retrievedConvo.push({
              id: doc.data().inquiryid,
              recipient: doc.data().recipient,
              subject: doc.data().subject,
              attachments: doc.data().attachments,
              date: doc.data().date,
              time: doc.data().time,
              status: `${doc.data().status}`,
              senderId: doc.data().senderId,
              message: `${doc.data().message}`,
            });
          });
          retrievedConvo.sort((a, b) => {
            const dateComparison = a.date.localeCompare(b.date);
            if (dateComparison !== 0) {
              return dateComparison;
            } else {
              return a.time.localeCompare(b.time);
            }
          });
          setConvo(retrievedConvo);
        });
    
        return () => unsubscribe();
      }
    }, [currentUser, message]); // Add message to the dependency array
    

    const handleResponseChange = (event) => {
      setResponse(event.target.value);
    }

  const handleResponse = async () => {
    console.log("Handle Response clicked.", currentUser)

    const docData = {
      inquiryid: message.id,
      recipient: message.recipient,
      subject: message.subject,
      message: response,
      senderId: currentUser.uid,
      date: Timestamp.now().toDate().toLocaleDateString(),
      time: Timestamp.now().toDate().toLocaleTimeString(),
      lastinteraction: currentUser.uid,
      status: 'Sent',
    };

    console.log("Data to be sent: ", docData)

    try {
      await setDoc(doc(db, 'inquiries', uuid()), docData)

      setResponse('');
    } catch (error) {
      console.error('Error:', error);
    }


  }
  return (
    <div className='h-full'>
      <div className='flex flex-col h-full'>
        <label className='flex text-2xl font-bold my-[20px]'>{message.subject}</label>
        <div className='content-container overflow-auto flex-grow'>
          {convo.map((data, index) => (
            <div key={index}>
              <div className={`${data.senderId===currentUser.uid ? 'items-end' : 'items-start'} flex flex-col w-full h-full`}>
                <div className={`${data.senderId===currentUser.uid ? 'bg-slate-300' : 'bg-[#F0F0F0]'} rounded-[20px] p-[10px] w-3/4`}>
                  <label className='w-full p-[10px]'>{data.message}</label>
                  <div className='mt-[20px]'>
                    {data.attachments && (
                      <div>
                        Attachments:
                        <Thumbnails downloadURLs={data.attachments}/>
                      </div>)}
                  </div>
                </div>
                
                {data.senderId===currentUser.uid ? 
                  <label className='text-xs flex justify-start mx-[10px] mt-[10px] mb-[25px]'>
                    Sent from <label className='font-bold mx-[5px]'>{data.recipient}</label> on {data.date} {data.time}
                  </label> :
                  <label className='text-xs flex justify-start mx-[10px] mt-[10px] mb-[25px]'>
                    Sent to <label className='font-bold mx-[5px]'>{data.recipient}</label> on {data.date} {data.time}
                  </label>
                }
              </div>
            </div>
          ))}
        </div>
        
        
        <div className='flex my-auto w-full'>
          {/*This area here */}
          <textarea
            value={response}
            onChange={handleResponseChange} 
            type="text" rows={5}  
            className='resize-none p-[5px] rounded-tl-[20px] rounded-bl-[20px] bg-[#F0F0F0] shadow-lg w-5/6'
          />
          <button 
              onClick={handleResponse}
              disabled={!response ? true : false}
              className='w-1/6 shadow-lg bg-[#115E59] hover:bg-[#883138] rounded-tr-[20px] rounded-br-[20px] py-1.5 px-2.5 text-white flex items-center justify-center transition-all'>
                Send
                <SendRoundedIcon
                  className='ml-1.5'
                />
          </button>
        </div>
      </div>
    </div>
  )
}

function Thumbnails({ downloadURLs }) {

  function filterFilename(downloadURL, maxLength) {
    const regex = /%2F(?:.*%2F)?(.*?)\?alt/;
    const match = regex.exec(downloadURL);
    if (match && match[1]) {
      let decodedFilename = decodeURIComponent(match[1]);
      if (decodedFilename.length > maxLength) {
        const halfLength = Math.floor(maxLength / 2);
        const firstHalf = decodedFilename.substr(0, halfLength);
        const secondHalf = decodedFilename.substr(-halfLength);
        decodedFilename = `${firstHalf}... ${secondHalf}`;
      }
      return decodedFilename;
    }
    return null;
  }

return (
  <div>
    {downloadURLs.map((url, index) => (
      <div key={index}>
          <label className='ml-[10px]'>{index + 1}.</label><a className='ml-[10px] font-bold' href={url} target="_blank" rel="noopener noreferrer">{filterFilename(url, 40)}</a>
      </div>
    ))}
  </div>
);
}

export default Message

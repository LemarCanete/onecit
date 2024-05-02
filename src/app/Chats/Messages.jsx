import React, {useState, useEffect, useRef} from 'react'
import { IoCall, IoVideocam, IoInformationCircle } from "react-icons/io5";
import { TfiGallery } from "react-icons/tfi";
import { RiEmojiStickerFill, RiEmojiStickerLine } from "react-icons/ri";
import searchUserInput from '@/components/SearchUserInput';
import { BsThreeDots, BsThreeDotsVertical, BsX } from 'react-icons/bs';
import { Timestamp, addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from '@/firebase-config';
import ChatSettings from './ChatSettings';
import EmojiPicker from 'emoji-picker-react'
import { PiGif } from "react-icons/pi";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'


const formatTimestamp = (timestamp) => {
    const date = timestamp.toDate(); // Convert Firebase Timestamp to JavaScript Date object
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12 || 12;

    return `${days[date.getDay()]} ${hours}:${minutes < 10 ? '0' + minutes : minutes} ${amOrPm}`;
}

const Messages = ({addChat, currentUser, selectedChat, setAddChat}) => {
    const [members, setMembers] = useState([])
    const [filteredUsers, setFilteredUsers] = useState([])
    const [searchTo, setSearchTo] = useState("")
    const [chatId, setChatId] = useState('');
    const [message, setMessage] = useState('');
    const [settings, setSettings] = useState(false)
    const [messageList, setMessageList] = useState([]);
    const [files, setFiles] = useState([]);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false)
    const [emoji, setEmoji] = useState('')
    const messageRef = useRef()

    useEffect(()=>{
        const fetchData = async() =>{
            const resultUsers = await searchUserInput(searchTo)
            const filteredResult = resultUsers.filter(user => 
                !members.some(member => member.uid === user.uid)
            );
            setFilteredUsers(filteredResult);
        }

        searchTo !== "" && fetchData();
        if(searchTo === "") setFilteredUsers([]);

    }, [searchTo])

    useEffect(()=>{
        if(!addChat) {
            setMembers([])   
        }
        if(addChat){
            setMessageList([])
            setSettings(false)
        }

    }, [addChat])

    //get messages of selected chat
    useEffect(()=>{
        const fetchData = () =>{
            const q = query(collection(db, "messages"), where("chatId", "==", selectedChat.id));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const messageListArr = [];
                querySnapshot.forEach((doc) => {
                    messageListArr.push({id: doc.id, ...doc.data()});
                });
                setMessageList(messageListArr)
            });
        }

        selectedChat?.id && fetchData()
    }, [selectedChat])

    useEffect(()=>{
        messageRef.current?.scrollIntoView({behavior: "smooth"})
    }, [messageList])

    const addMessage = async(e) =>{
        if(message === "") return
        try{
            if (e.key === 'Enter' && selectedChat.type === 'newMessage') {
                const memberIds = new Set([currentUser.uid, ...members.map(member => member.uid)]);
                const uniqueMembers = Array.from(memberIds);
    
                const chatRef = await addDoc(collection(db, "chats"), {
                    "type": members.length > 1 ? "Group" : "User",
                    "members": uniqueMembers,
                    "lastMessage": message,
                    "lastUpdated": Timestamp.now(),
                });
    
                if (message !== "") {
                    await addDoc(collection(db, "messages"), {
                        "chatId": chatRef.id,
                        "senderId": currentUser.uid,
                        "content": message,
                        "type": "text",
                        "timestamp": Timestamp.now(),
                    });
                }
    
                if (files.length > 0) {
                    const storage = getStorage();
    
                    for (const file of files) {
                        const storageRef = ref(storage, 'chatsFiles/' + file.name);
                        const uploadTask = uploadBytesResumable(storageRef, file, file.type);
    
                        uploadTask.on('state_changed',
                            (snapshot) => {
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                                switch (snapshot.state) {
                                    case 'paused':
                                        alert('Upload is paused');
                                        break;
                                    case 'running':
                                        console.log('Upload is running');
                                        break;
                                }
                            },
                            (error) => {
                                switch (error.code) {
                                    case 'storage/unauthorized':
                                        break;
                                    case 'storage/canceled':
                                        break;
                                    case 'storage/unknown':
                                        break;
                                }
                            },
                            async () => {
                                try {
                                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                    console.log('File available at', downloadURL);
    
                                    await addDoc(collection(db, "messages"), {
                                        "chatId": chatRef.id,
                                        "senderId": currentUser.uid,
                                        "content": file.name,
                                        "timestamp": Timestamp.now(),
                                        "type": file.type,
                                        "url": downloadURL,
                                        "size": file.size
                                    });
    
                                    await updateDoc(doc(db, "chats", chatRef.id), {
                                        "lastMessage": message || "sent a file",
                                        "lastUpdated": Timestamp.now(),
                                    });
    
                                } catch (error) {
                                    console.error("Error uploading file:", error);
                                }
                            }
                        );
                    }
                }
    
                setFiles([]);
                setAddChat(false);
                setMessage('');
                return;
            }else if(e.key === "Enter" && (message !== "" || files.length > 0)){
                //message
                if(message !== ""){
                    const MessageRef = await addDoc(collection(db, "messages"), {
                        "chatId": selectedChat.id,
                        "senderId": currentUser.uid,
                        "content": message,
                        "timestamp": Timestamp.now(),
                        "type": "text"
                    });
                }
                
                // files
                if(files.length > 0){
                    for(const file of files){
                        const storage = getStorage();
                        // Upload file and metadata to the object 'images/mountains.jpg'
                        const storageRef = ref(storage, 'chatsFiles/' + file.name);
                        const uploadTask = uploadBytesResumable(storageRef, file, file.type);

                        // Listen for state changes, errors, and completion of the upload.
                        uploadTask.on('state_changed',
                        (snapshot) => {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            switch (snapshot.state) {
                            case 'paused':
                                alert('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                            }
                        }, 
                        (error) => {
                            switch (error.code) {
                            case 'storage/unauthorized':
                                // User doesn't have permission to access the object
                                break;
                            case 'storage/canceled':
                                // User canceled the upload
                                break;

                            // ...

                            case 'storage/unknown':
                                // Unknown error occurred, inspect error.serverResponse
                                break;
                            }
                        }, 
                        () => {
                            getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                                console.log('File available at', downloadURL);
                                const MessageRef = await addDoc(collection(db, "messages"), {
                                    "chatId": selectedChat.id,
                                    "senderId": currentUser.uid,
                                    "content": file.name,
                                    "timestamp": Timestamp.now(),
                                    "type": file.type,
                                    "url": downloadURL,
                                    "size": file.size
                                });
                            });
                        }
                        );
                    }
                }

                setMessage('')
                setFiles([]);

                const chatRef = await updateDoc(doc(db, "chats", selectedChat.id), {
                    "lastMessage": message || "sent a file",
                    "lastUpdated": Timestamp.now(),
                });
            }
        }catch(err){
            alert(err.message)
        }
    }
    const chatName = () =>{
        let membersNames = '';
        if (selectedChat.type === "Group") {
            membersNames = selectedChat.membersData.map(m => m.firstname).join(', ');
        } else {
            const otherMember = selectedChat.membersData.find(m => m.uid !== currentUser.uid);
            membersNames = otherMember?.firstname || '';
        }
        return membersNames
    }

    return (
        <div className="col-span-9 bg-white h-screen flex">
            <div className={`relative ${settings ? 'w-8/12' : 'w-full'}`}>
                {/* header */}
                <div className="flex justify-between items-center shadow p-2">
                    {selectedChat && <h1 className="text-lg font-bold text-left">{selectedChat?.name || chatName()}</h1>}
                    <div className="flex gap-2">
                        <IoCall className='text-teal-500 text-4xl cursor-pointer rounded-full hover:bg-neutral-100 p-2'/>
                        <IoVideocam className='text-teal-500 text-4xl cursor-pointer rounded-full hover:bg-neutral-100 p-2'/>
                        <IoInformationCircle className='text-teal-500 text-4xl cursor-pointer rounded-full hover:bg-neutral-100 p-2' onClick={()=> !addChat && setSettings(prev => !prev)}/>
                    </div>
                </div>

                {/* search and add users */}
                {addChat &&
                    <div className='relative text-sm mt-2'>
                        <div className='flex flex-wrap'>
                            <label htmlFor="" className='mx-2 py-2'>To: </label>
                            {/* added members */}
                            {members.length > 0 && 
                            <div className="col-span-2 flex flex-wrap border-b">
                            {members.map((member, key) => {
                                return <div className="bg-neutral-100 my-1 px-2 rounded-full flex gap-1 me-1 items-center" key={key}>
                                    <span className="" key={key}>{member.firstname} {member.lastname}</span>
                                    <BsX className='inline cursor-pointer text-lg' onClick={() => setMembers(prevMembers => prevMembers.filter((_, index) => index !== key))}/>
                                </div>
                            })}
                            </div>}
                            {/* search */}
                            <input type="text" className='border-b outline-none grow py-2' value={searchTo} onChange={e => setSearchTo(e.target.value)}/>
                        </div>

                    {searchTo && 
                        <div className="col-start-2 col-end-4 h-48 overflow-visible absolute z-50 bg-neutral-50 w-2/6 h-auto">
                        {filteredUsers.map((user, key) => {
                            return (
                            <div className="" key={key}>
                                <div className="grid grid-rows-3 grid-flow-col p-1 cursor-pointer hover:bg-neutral-100 w-full" onClick={()=> {setMembers(prev => [...prev, user]); setFilteredUsers([]); setSearchTo("")}}>
                                    <img src={`${user.photoURL || './schoolLogo.png'}`} alt="" className='row-span-3 w-12'/>
                                    <span className="p-0 m-0">{user.firstname} {user.lastname} {user.schoolid}</span>
                                    <span className="p-0 m-0">{user.email}</span>
                                </div>
                            </div>
                        )})}
                        </div>}
                    
                    </div>
                }

                {/* list messages */}
                <div className="w-full px-4 h-5/6 overflow-y-scroll mt-2" >
                    {messageList.sort((a, b) => a.timestamp - b.timestamp).map((message, index) => {
                        console.log(message)
                        const member = selectedChat.membersData.find(member => member.uid === message.senderId)
                        const getSenderData = () =>{
                            if(currentUser.uid !== message.senderId){
                                return <img src={member?.photoURL || `/schoolLogo.png`} alt="" className={`w-6 h-6 cursor-pointer rounded-full profile-sender-${message.id}`}/>
                            } else {
                                return null
                            }
                        }
                        let messageContent;
                        if(message.type.includes('image')){
                            messageContent = <img src={message.url} alt={message.content} className='max-h-20 cursor-pointer'/>
                        }else if(message.type.includes('application')){
                            messageContent = <div className={`rounded-full ${currentUser.uid === message.senderId ? 'bg-teal-500 text-white' : 'bg-neutral-100 text-black'} py-1 px-4`}>
                                <a href={message.url} className="hover:underline" target='__blank'>{message.content}</a>
                            </div>
                        }else if(message.type.includes('video')){
                            messageContent = <video className='h-96' controls autoPlay muted>
                                <source src={message.url} type="video/mp4" />
                            </video>
                        }else{
                            messageContent = <div className={`rounded-full ${currentUser.uid === message.senderId ? 'bg-teal-500 text-white' : 'bg-neutral-100 text-black'} py-1 px-4`}>
                                <p className={`message-sender-${message.id}`}>{message.content}</p>
                            </div>
                        }

                        return (
                            <div ref={messageRef}
                                className={`flex items-center gap-2 ${currentUser.uid === message.senderId ? 'justify-end' : 'justify-start'} mb-2`} 
                                key={index}
                            >
                                {getSenderData()}
                                {currentUser.uid === message.senderId && <BsThreeDotsVertical className='hidden'/>}
                                {messageContent}
                                {currentUser.uid !== message.senderId && <BsThreeDotsVertical className='hidden'/>}

                                <Tooltip anchorSelect={`.message-sender-${message.id}`} content={formatTimestamp(message?.timestamp)} />
                                <Tooltip anchorSelect={`.profile-sender-${message.id}`} content={`${member?.firstname} ${member?.lastname}`} />
                                
                            </div>
                        )
                    })}
                </div>
                
                <EmojiPicker open={openEmojiPicker} className='absolute' style={{position: "absolute", bottom: "70px", left: "110px"}} 
                    onEmojiClick={emj => setMessage(prev => prev + emj.emoji)}/>

                {/* picture, emoji, message */}
                <div className="flex justify-around items-center w-full absolute bottom-0 start-0 mb-5">
                    <input type="file" id='file' className='hidden' onChange={(e)=>setFiles(prev => [...prev, e.target.files[0]])}/>
                    <label htmlFor="file">
                        <TfiGallery className='p-2 hover:bg-neutral-100 rounded-full cursor-pointer text-teal-900 text-4xl'/>
                    </label>
                    <RiEmojiStickerFill className='p-2 hover:bg-neutral-100 rounded-full cursor-pointer text-teal-900 text-4xl' onClick={()=> setOpenEmojiPicker(prev => !prev)}/>
                    {/* <PiGif className='p-2 hover:bg-neutral-100 rounded-full cursor-pointer text-teal-900 text-4xl'/> */}
                    <div className="w-5/6 relative">
                        <input type="text" 
                            className='w-full border rounded-full p-2 outline-none text-sm ps-3' 
                            placeholder='Aa' onKeyDown={e => addMessage(e)}
                            value={message}
                            onChange={e => setMessage(e.target.value)}/>
                        <div className="absolute top-0 left-0 mb-20 ms-10 flex">
                            {files.length > 0 && files.map((file, key) => {
                                if(file){
                                    const fileName = file.name.length > 15 ? `${file.name.substring(0, 12)}...` : file.name;
                                    return <p className='bg-neutral-100 text-sm rounded-full px-4 me-1 mt-2' key={key}>
                                        {fileName}
                                        <span className="ms-4 cursor-pointer" onClick={()=>setFiles(files.filter(f => f.lastModifiedDate !== file.lastModifiedDate && f.name !== file.name))}>x</span>
                                        
                                    </p>
                                }
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Section */}
            {settings && selectedChat && !addChat && <ChatSettings selectedChat={selectedChat} currentUser={currentUser} messageMediaFiles={messageList.filter(message => message.type !== 'text')}/>}
        </div>
    )
}

export default Messages
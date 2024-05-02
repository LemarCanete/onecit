import React, { useContext, useEffect, useState } from 'react'
import { IoCreateOutline, IoSearch } from "react-icons/io5";
import Messages from './Messages';
import { AuthContext } from '@/context/AuthContext';
import { Timestamp, collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/firebase-config';

const ChatsSection = () => {
    const [addChat, setAddChat] = useState(false)
    const {currentUser} = useContext(AuthContext)
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState();
    const [filteredChat, setFilteredChat] = useState(chats);

    //get chats
    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, "chats"), where("members", "array-contains", currentUser.uid));
            const unsubscribe = onSnapshot(q, async (querySnapshot) => {
                const chats = [];
                querySnapshot.forEach((doc) => {
                    const chatData = doc.data();
                    const id = doc.id;
                    chats.push({ ...chatData, id });
                });

                const chatsComplete = await Promise.all(chats.map(async (chat) => {
                    const membersData = await Promise.all(chat.members.map(async (c) => {
                        const docSnap = await getDoc(doc(db, "users", c));
                        return docSnap.data();
                    }));

                    return { ...chat, membersData };
                }));
                
                if(chatsComplete.length < 1){
                    setChats(prev => [
                        {
                            lastMessage: "New message...",
                            lastUpdated: Timestamp.now(),
                            members: [],
                            membersData: [],
                            type: 'newMessage',
                            name: 'New message'
                        }, ...prev
                    ])
                    setAddChat(prev => true); 
                } else{
                    addChat && setChats(prev => prev.filter(chat => chat.type !== 'newMessage'))
                    setChats(chatsComplete);
                    setFilteredChat(chatsComplete)
                }
            });

            return () => unsubscribe();
        };

        if (currentUser.uid) {
            fetchData();
        }
    }, [currentUser]);

    useEffect(()=>{
        setSelectedChat(chats.sort((a, b) => b.lastUpdated - a.lastUpdated)[0])
    }, [chats])

    const filterChat = (e) => {
        const search = e.target.value.toLowerCase();
        const chatList = chats.filter(chat => {
            const chatName = chat.name ? chat.name.toLowerCase() : '';
            const memberNames = chat.membersData.map(member => 
                `${member.firstname} ${member.lastname}`.toLowerCase()
            ).join(', ');
    
            return chatName.includes(search) || memberNames.includes(search);
        });
    
        setFilteredChat(chatList);
    }

    return (
        <div className='grow gap-1'>
            <div className="grid grid-cols-12 gap-1 h-dvh">
                {/* Chat Section */}
                <div className="col-span-3 bg-white p-2 overflow-hidden">
                    <div className="flex justify-between items-center mt-1 mb-2">
                        <h1 className="text-xl ">Chats</h1>

                        <div className="flex gap-2">
                            <IoCreateOutline 
                                className='text-4xl rounded-full p-2 cursor-pointer bg-neutral-100 hover:bg-neutral-300' 
                                onClick={() => {
                                    setAddChat(prev => !prev); 
                                    // setSelectedChat({name: "New message"})
                                    !addChat && setChats(prev => [
                                        {
                                            lastMessage: "New message...",
                                            lastUpdated: Timestamp.now(),
                                            members: [],
                                            membersData: [],
                                            type: 'newMessage',
                                            name: 'New message'
                                        }, ...prev
                                    ])

                                    addChat && setChats(prev => prev.filter(chat => chat.type !== 'newMessage'))
                                }}
                            />
                        </div>
                    </div>
                    {/* Search messages */}
                    <div className="relative mb-2">
                        <input type="text" placeholder='Search chats' className='border w-full p-2 rounded-full ps-10 outline-none text-sm' onChange={(e) => filterChat(e)}/>
                        <IoSearch className='top-0 absolute left-0 ms-3 mt-2 text-xl'/>
                    </div>
                    {/* Chats List */}
                    {filteredChat.length > 0 && filteredChat.sort((a, b) => b.lastUpdated - a.lastUpdated).map((chat, key) => {
                        const selected = chat.id === selectedChat?.id
                        let membersNames = '';
                        if (chat.type === "Group") {
                            membersNames = chat.membersData.map(m => m.firstname).join(', ').substring(0, 40) + '...';
                        } else {
                            const otherMember = chat.membersData.find(m => m.uid !== currentUser.uid);
                            membersNames = `${otherMember?.firstname} ${otherMember?.lastname}` || '';
                        }
                        return (
                            <div className="" key={key}>
                                <div className={`flex gap-5 text-sm hover:bg-neutral-100 cursor-pointer p-2 rounded-lg ${selected && 'bg-neutral-200'}`} onClick={()=>setSelectedChat(chat)}>
                                    <img src={chat.type === "User" ? chat.membersData.find(member => member.uid !== currentUser.uid)?.photoURL || '/schoolLogo.png': chat?.photoURL || '/schoolLogo.png'} alt="" className='w-10 rounded-full'/>
                                    <div className="">
                                        {chat?.name ? <p className="font-bold">{chat.name}</p> : <p className="font-bold">{membersNames}</p>}
                                        <h1 className="">{chat?.lastMessage}</h1>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    
                </div>
                {/* Messages Section */}
                <Messages addChat={addChat} currentUser={currentUser} selectedChat={selectedChat} setAddChat={setAddChat} />

                
            </div>
        </div>
        
    )
}

export default ChatsSection
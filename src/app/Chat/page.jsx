'use client'
import React, { useContext, useEffect, useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import {collection, doc, query, setDoc, getDocs, updateDoc, serverTimestamp, getDoc, onSnapshot} from 'firebase/firestore'
import { db } from '@/firebase-config'
import { useCookies } from 'react-cookie'
import { ChatContext } from '@/context/ChatContext'
import Messages from './Messages'
import Input from './Input'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'

const page = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [chats, setChats] = useState([])
    const [currentUser, setCurrentUser] = useState([]);
    const [cookies] = useCookies(['id']);
    const [email, setEmail] = useState("");

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const email = urlParams.get('email');
    
        if (email) {
          setEmail(email)
        }
      }, []);

    const userId = cookies['id'];
    const {dispatch} = useContext(ChatContext)
    const {data} = useContext(ChatContext)
    console.log(data)
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
                const currentUser = AllUsersResults.filter((userInfo)=> userId === userInfo.uid)[0]
                setCurrentUser(currentUser);
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [])
    console.log(chats)
    useEffect(()=>{
        const getChats = () =>{
            const unsub = onSnapshot(doc(db, "userChats", userId), (doc) => {
                setChats(doc.data())
                console.log(" data: ", doc.data());
            });
            return () =>{
                unsub()
            }
        }
        userId && getChats();
    }, [userId])
    console.log(Object.entries(chats))

    const handleOnSearch = (string=email, results) => {
        console.log(string)
        console.log(results)
    }
    const handleOnSelect = async(item) => {
        // setReceiver(item)
        // setAllChats(prev => [{name: `${item.firstname} ${item.lastname}`}, ...prev])
        // check wether the group (chats in firestore) exists, if not create
        const combinedId = userId > item.uid ? userId + item.uid : item.uid + userId;
        try{
            const res = await getDoc(doc(db, "chats", combinedId))
            console.log(res)
            if(!res.exists()){
                //create chat in chats collection
                await setDoc(doc(db, "chats", combinedId), { messages: [] })
                //create user chats
                await updateDoc(doc(db, "userChats", userId), {
                    [combinedId + ".userInfo"] : {
                        uid: item.uid,
                        displayName: `${item.firstname} ${item.lastname}`,
                        photoURL: item.photoURL
                    },
                    [combinedId+".date"]:serverTimestamp()
                })
                //create user chats
                await updateDoc(doc(db, "userChats", item.uid), {
                    [combinedId + ".userInfo"] : {
                        uid: userId,
                        displayName: `${currentUser.firstname} ${currentUser.lastname}`
                    },
                    [combinedId+".date"]:serverTimestamp()
                })
            }
        }catch(err){
            console.log(err)
        }
        //create user chats
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

    const handleSelect = (u) =>{
        dispatch({type: "CHANGE_USER", payload: u})
    }



    return (
        <div className='w-full  h-screen flex bg-neutral-100 snap-none'>
            <NavbarIconsOnly active="Chat"/>
            <div className="grow flex">
                <div className="bg-white w-3/12 h-full  ms-2">
                    <h1 className="p-3">Messages (12)</h1>
                    <hr />
                    <ReactSearchAutocomplete items={allUsers}
                        onSearch={handleOnSearch}
                        onSelect={handleOnSelect}
                        autoFocus
                        value={email}
                        placeholder={email}
                        formatResult={formatResult}
                        fuseOptions={{keys: ['firstname', "lastname", "email", "schoolid"], threshold: 0.2}}
                        styling={{ fontSize: "14px", border: "0 0 1px 0 solid #dfe1e5", borderRadius: "0px",  boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 0px 0px"}} 
                        resultStringKeyName="schoolid"/>
                    <div className="">
                        {Object.entries(chats)?.sort((a, b)=> b[1].date - a[1].date).map((chat, id) => (
                            <div className="grid grid-flow-col grid-rows-2 px-3 py-2 hover:bg-neutral-50 cursor-pointer" key={chats[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
                                <img src={chat[1].userInfo.photoURL ? chat[1].userInfo.photoURL : 'schoolLogo.png'} alt="" className='row-span-2 h-12 w-12'/>
                                <p className="font-bold text-sm">{chat[1].userInfo.displayName}</p>
                                <p className="col-span-6 text-sm">{chat[1].lastMessage?.message ? chat[1].lastMessage.message : <span className='italic'>New message..</span>}</p>
                            </div>
                        ))}
                    </div>


                </div>
                <div className="grow flex justify-between flex-col">
                    <div className="border flex bg-white p-2">
                        <p className='mx-2'>{data.user.displayName}</p>
                        <p className='mx-2 font-bold cursor-pointer'>Chat</p>
                        <p className='mx-2 cursor-pointer'>Files</p>
                    </div>
                        
                        {/* Display messages */}
                    <Messages />
                        

                    <Input />
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
import React, { useEffect, useState } from 'react'
import { BsPersonCircle, BsSearch } from 'react-icons/bs'
import { TfiArrowLeft, TfiFile, TfiFiles, TfiGallery, TfiPencil } from "react-icons/tfi";
import Modal from 'react-modal'
import Collapse from 'rc-collapse'

const Panel = Collapse.Panel;
import 'rc-collapse/assets/index.css'
import ProfileCard from '@/components/ProfileCard'
import { Timestamp, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '1300px',
      minWidth: '500px'
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5"
    }
};

Modal.setAppElement("body")
const ChatSettings = ({selectedChat, currentUser, messageMediaFiles}) => {
    const [membersData, setMembersData] = useState(selectedChat.membersData)
    const [filteredUsers, setFilteredUsers] = useState(membersData.filter(member => member.uid !== currentUser.uid))
    const [viewProfile, setViewProfile] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState({});
    const [isMediaFiles, setIsMediaFiles] = useState({clicked: "Media", isOpen: false})
    const [viewMediaFiles, setViewFiles] = useState(messageMediaFiles);
    const [chatName, setChatName] = useState(selectedChat?.name || '');
    const [isCustomizeChat, setIsCustomizeChat] = useState(false)
    const [chatPhoto, setChatPhoto] = useState({});

    useEffect(() => {
        if (selectedChat) {
            setMembersData(selectedChat.membersData);
            setViewFiles(messageMediaFiles);
            setChatName(selectedChat?.name || '')
        }
    }, [selectedChat, messageMediaFiles]);
    
    useEffect(() => {
        if (membersData) {
            setFilteredUsers(membersData.filter(member => member.uid !== currentUser.uid));
        }
    }, [membersData, currentUser]);

    useEffect(()=>{
        const updateChatPhoto = () =>{
            if (!chatPhoto.type.includes('image')) {
                alert('Please select an image file.');
                return;
            }
            const storage = getStorage();

            const storageRef = ref(storage, 'chatPhotos/' + chatPhoto.name);
            const uploadTask = uploadBytesResumable(storageRef, chatPhoto, chatPhoto.type);

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
                    const washingtonRef = doc(db, "chats", selectedChat.id);
                    await updateDoc(washingtonRef, {
                        photoURL: downloadURL,
                        lastUpdated: Timestamp.now(),
                        lastMessage: "Changed chat photo"
                    });
                });
            }
            );
        }

        chatPhoto.type && chatPhoto.type.includes('image') && updateChatPhoto()
    }, [chatPhoto, selectedChat])

    const renderImg = () =>{
        if(selectedChat.type === "Group"){
            return (
                <div className="flex flex-col gap-4 justify-center items-center">
                    <img src={selectedChat?.photoURL || '/schoolLogo.png'} alt="" className='w-20 rounded-full'/>
                    <p className="text-center">{selectedChat?.name || membersData.map(member => member.firstname).join(', ').substring(0,40) + ' ...'}</p>

                    <div className="flex justify-center items-center gap-8">
                        <BsSearch className='p-2 rounded-full bg-neutral-100 text-4xl cursor-pointer'/>
                    </div>
                </div>
            )
        }else{
            return (
                <div className="mx-auto flex flex-col gap-4">
                    <img src={filteredUsers[0]?.photoURL || '/schoolLogo.png'} alt="" className='w-20 mx-auto'/>
                    <p className="">{filteredUsers[0].firstname} {filteredUsers[0].lastname}</p>

                    <div className="flex justify-center items-center gap-8">
                        {selectedChat.type === "User" && <BsPersonCircle className='p-2 rounded-full bg-neutral-100 text-4xl cursor-pointer' 
                        onClick={()=>{
                            setSelectedProfile(filteredUsers[0]);
                            setViewProfile(true)
                        }}/>}
                        <BsSearch className='p-2 rounded-full bg-neutral-100 text-4xl cursor-pointer'/>
                    </div>
                </div>
            )
        }
    }   

    const customizeChat = async() =>{
        const chatRef = doc(db, "chats", selectedChat.id);
        await updateDoc(chatRef, {
            name: chatName
        });
        setIsCustomizeChat(false)
        alert("Changed name successfully!")
    }


    const groupAccordion = () =>{
        return (
            <Collapse accordion={true} style={{background: "white", border: "none", marginTop: "20px"}}>
                <Panel header="Customize Chat" style={{border: "none"}}>
                    <div className="mx-2 text-sm">
                        <p className="flex gap-3 items-center p-2 cursor-pointer hover:bg-neutral-100 rounded" onClick={()=>setIsCustomizeChat(true)}>
                            <span className=""><TfiPencil /></span>
                            Change name
                        </p>
                        <label className="flex gap-3 items-center p-2 cursor-pointer hover:bg-neutral-100 rounded" htmlFor='chatPhoto'>
                            <span className=""><TfiGallery /></span>
                            Change photo
                        </label>
                        <input type="file" className='hidden' id='chatPhoto' onChange={(e) => setChatPhoto(e.target.files[0])}/>
                    </div>
                </Panel>
                <Panel header="Chat Members" style={{border: "none"}}>
                    {selectedChat.membersData.map((member, key) => {
                        return (
                            <div className="flex gap-2 text-sm p-2 hover:bg-neutral-100 cursor-pointer rounded-lg" key={key}>
                                <img src={member?.photoURL || '/schoolLogo.png'} alt="" className='w-10 rounded-full' 
                                onClick={() =>{
                                    setSelectedProfile(member);
                                    setViewProfile(true);
                                }}/>
                                <div className="">
                                    <h3 className="font-bold">{member.firstname} {member.lastname}</h3>
                                    <p className="">{member.program}</p>
                                </div>
                            </div>
                        )
                    })}
                </Panel>
            </Collapse>
            )
    }

    if(isMediaFiles.isOpen){
        const content = ['Media', 'Files'];
        return (
            <div className="px-2 py-4 w-2/6 border">
                <div className="flex items-center gap-4">
                    <TfiArrowLeft onClick={()=>setIsMediaFiles({clicked: "Media", isOpen: false})} className='cursor-pointer'/>
                    <span className='font-bold'>Media, files, and links</span>
                </div>
                
                <div className="flex gap-8 py-4 mx-4">
                    {content.map((c, key) => {
                        return (
                            <div className="" key={key}>
                                <p className={`${isMediaFiles.clicked === c && 'text-teal-500 border-b'} py-4 cursor-pointer`} onClick={()=>setIsMediaFiles({clicked: c, isOpen: true})}>{c}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="grid grid-cols-4 gap-1">
                    {isMediaFiles.clicked === "Media" && viewMediaFiles.filter(image => image.type.includes('image') || image.type.includes('video')).map((img, key) => (
                        img.type.includes('image') ? 
                            <img src={img.url} alt={img.content} className="border w-20" key={key}/>
                        : <video className='h-20 w-20' controls muted key={key}>
                            <source src={img.url} type="video/mp4" />
                        </video>
                    
                    ))}
                </div>
                <div className="text-sm gap-2 flex flex-col">
                    {isMediaFiles.clicked === "Files" && viewMediaFiles.filter(file => file.type.includes('application')).map((f, key) => (
                        <div className="flex gap-4 cursor-pointer" key={key}>
                            <p className="bg-neutral-100 p-5">
                                <TfiFile className='bg-neutral-100 rounded text-lg'/>
                            </p>
                            <div className="">
                                <a href={f.url} className="hover:underline font-semibold" target='__blank'>{f.content.replace(/_/g, " ")}</a>
                                <span className="block">{file.size}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }


    return (
        <div className="grow bg-white px-2 py-8 border">
            <div className="flex flex-col gap-4">
                {renderImg()}
            </div>

            <Collapse accordion={true} style={{background: "white", border: "none", marginTop: "20px"}}>
                {selectedChat.type === "Group" && groupAccordion()}
                <Panel header="Media, Files and Links" style={{border: "none"}} >
                    <p className="flex gap-2 items-center hover:bg-neutral-100 cursor-pointer p-2" onClick={()=>setIsMediaFiles({clicked: "Media", isOpen: true})}>
                        <TfiGallery />
                        <span className=''>Media</span>
                    </p>
                    <p className="flex gap-2 items-center hover:bg-neutral-100 cursor-pointer p-2" onClick={()=>setIsMediaFiles({clicked: "Files", isOpen: true})}>
                        <TfiFiles />
                        <span className="">Files</span>
                    </p>
                </Panel>
            </Collapse>

            <Modal isOpen={viewProfile} onRequestClose={()=>{setViewProfile(false); setSelectedProfile({})} } style={customStyles}>
                <ProfileCard userData={selectedProfile}/>
            </Modal>
            <Modal isOpen={isCustomizeChat} onRequestClose={()=>{setIsCustomizeChat(false)} } style={customStyles}>
                <div className="flex flex-col gap-6">
                    <label htmlFor="">Changing the name of a group chat changes it for everyone</label>
                    <input type="text" className='block border w-full outline-none border-teal-500 py-4 px-2'
                        onChange={e => setChatName(e.target.value)} value={chatName}/>

                    <div className="self-end">
                        <button className="teal-teal-500 py-2 px-5 rounded-lg" onClick={()=> setIsCustomizeChat(false)}>Cancel</button>
                        <button className='bg-teal-500 text-white py-2 px-5 rounded-lg' 
                            disabled={chatName === selectedChat?.name}
                            onClick={customizeChat}>Save</button>
                    </div>
                </div>


            </Modal>
        </div>
    )
}


export default ChatSettings
'use client'
import React, { useContext, useEffect, useState } from 'react'
import { BiSolidBell, BiSolidMoon, BiSolidSun, BiSolidUserCircle } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import {toggle} from '@/components/GloabalRedux/Features/darkModeSlice'
import { profileToggle } from './GloabalRedux/Features/showProfileSlice'
import Modal from 'react-modal'
import Notification from './Notification'
import { AuthContext } from '@/context/AuthContext'
import { collection, where, query, onSnapshot, Timestamp, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/firebase-config'

const customStyles = {
    content: {
      top: '9%',
      left: 'auto',
      right: '5%',
      bottom: 'auto',
    //   marginRight: '-30%',
    //   transform: 'translate(-50%, -50%)',
        width: '400px',
        height: '700px',
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        border: "none",
        padding: '0px'
    },
    overlay:{
      backgroundColor: "transparent"
    }
};

const Top = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([])
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    const dispatch = useDispatch()
    
    useEffect(()=>{
        const fetchData = () =>{
            const q = query(collection(db, "notifications"), where("receivedByUid", "==", currentUser.uid));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const list = [];
                querySnapshot.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()});
                });
                setNotifications(list);
            });            
        }
        currentUser.uid && fetchData();
    }, [currentUser])

    useEffect(() => {
        if (!currentUser || !currentUser.uid) {
          return;
        }
      
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const oneWeekLater = new Date(today);
        const oneDayLater = new Date(today);
      
        oneWeekLater.setDate(today.getDate() + 7);
        oneDayLater.setDate(today.getDate() + 1);
      
        const qTasks = query(collection(db, "tasks"), where("uid", "==", currentUser.uid));
      
        const checkAndAddNotification = async (task, type, message) => {
          const qNotification = query(
            collection(db, "notifications"),
            where("taskId", "==", task.id),
            where("condition", "==", type)
          );
      
          const snapshot = await getDocs(qNotification);
      
          if (snapshot.empty) {
            await addDoc(collection(db, "notifications"), {
              taskId: task.id,
              senderName: currentUser.displayName || currentUser.email,
              senderUid: currentUser.uid,
              receivedByUid: currentUser.uid,
              senderMessage: message,
              date: Timestamp.now(),
              link: '/TaskManagement',
              isRead: false,
              condition: type,
            });
          }
        };
      
        const handleTaskSnapshot = async (querySnapshot) => {
          for (const doc of querySnapshot.docs) {
            const task = doc.data();
            const duedate = new Date(task.duedate);
            duedate.setHours(0, 0, 0, 0);
      
            // One Week Later Notification
            if (task.status !== "Completed" && duedate === oneWeekLater) {
              await checkAndAddNotification(
                task,
                'OneWeekLater',
                `Your task "${task.title}" is due in a week on ${duedate.toISOString().split("T")[0]}.`
              );
            }
      
            // One Day Later Notification
            if (task.status !== "Completed" && duedate === oneDayLater) {
              await checkAndAddNotification(
                task,
                'OneDayLater',
                `Your task "${task.title}" is due tomorrow on ${duedate.toISOString().split("T")[0]}.`
              );
            }
      
            // Past Due Notification
            if (task.status !== "Completed" && duedate < today) {
              await checkAndAddNotification(
                task,
                'PastDue',
                `Your task "${task.title}" was due on ${duedate.toISOString().split("T")[0]}. Please complete it ASAP.`
              );
            }
          }
        };
      
        const unsubscribeTasks = onSnapshot(qTasks, handleTaskSnapshot);
      
        return () => {
          unsubscribeTasks();
        };
      }, [currentUser]);
      
    
    
      
    return (
        // <div className="w-full flex justify-between items-center">
            // <input type="search" className='grow rounded-lg p-2 ps-5 border-b outline-none' placeholder='Search'/>
            <div className="">
                <div className="inline bg-white rounded-lg p-2 mx-5 cursor-pointer" onClick={()=>dispatch(toggle())}>
                    {mode ? <BiSolidSun className='inline text-teal-800 text-2xl'/> : <BiSolidMoon className='inline text-teal-800 text-2xl'/>}
                </div>
                <div className={`relative inline bg-white rounded-lg p-2 cursor-pointer ${!profile && 'me-44'}`}>
                    <BiSolidBell className='inline text-teal-800 text-2xl' onClick={()=>setIsOpen(prev => !prev)}/>
                    {notifications.filter(notification => !notification.isRead).length > 0 && (
                        <span className="bg-red-500 text-white rounded-full absolute text-sm h-5 w-5 text-center my-auto top-0 mb-10">
                            {notifications.filter(notification => !notification.isRead).length}
                        </span>
                    )}

                </div>
                {!profile && <div className="inline bg-white rounded-lg p-2 cursor-pointer" onClick={()=> dispatch(profileToggle())}>
                    <BiSolidUserCircle className='inline text-teal-800 text-3xl'/>
                </div>}

                {notifications && <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false) } style={customStyles} >
                    <Notification notifications={notifications}/>                
                </Modal>}
            </div>
            
        // </div>
    )
}

export default Top
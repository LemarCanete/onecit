'use client'
import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { addDoc, collection, doc, setDoc, query, where, getDocs, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import React, { useContext, useRef, useState, useEffect } from 'react'
import { BsX } from 'react-icons/bs';

const UpdateForm = ({setIsEdit, appointment, currentUser}) => {

    const ref = useRef();
    
    const [err, setErr] = useState("")
    const [phonenumber, setPhonenumber] = useState(appointment.phonenumber);
    const [date, setDate] = useState(appointment.date);
    const [reason, setReason] = useState(appointment.reason);
    const [status, setStatus] = useState(appointment.status)
    const [participants, setParticipants] = useState(appointment.participants);
    const [to, setTo] = useState(appointment.to)
    const [search, setSearch] = useState("");

    const handleSearch = async () => {
        const q = query(collection(db, "users"), where("email", "==", search));
    
        const querySnapShot = await getDocs(q);
        if (!querySnapShot.empty) {
            querySnapShot.forEach(doc => {
                const user = doc.data();
                if(user.role === 'admin') {
                    setErr("You can't add admin");
                    return;
                }
                if(currentUser.email === search) {
                    setErr("You can't add yourself");
                    return;
                }
                // Check if the user is already added
                if (!participants.some(participant => participant.email === user.email)) {
                    setParticipants(prev => [...prev, { status: "Pending", ...user }]);
                    setSearch("");
                    setErr("");
                } else {
                    setErr("User is already added!");
                }
            });
        } else {
            setErr("User does not exist!");
        }
    };
    
    const handleKey = (e) =>{
        e.key === "Enter" && handleSearch();
    }
    console.log(participants)
    const handleUpdate = async() =>{
        if(date === null) return;
        try{
            await updateDoc(doc(db, "appointments", appointment.id), 
                {
                    phonenumber: phonenumber,
                    date: date,
                    reason: reason,
                    to: participants.map(participant => {
                        const statusObj = to.find(t => t.uid === participant.uid);
                        return { uid: participant.uid, status: statusObj ? statusObj.status : 'Pending' };
                    }),
                    status:  status
                }); 

                // Send notifications to all participants about the changed status
                appointment.to.forEach(async (participant) => {
                    await addDoc(collection(db, "notifications"), 
                        {
                            senderName: `${currentUser.firstname} ${currentUser.lastname}`,
                            senderUid: currentUser.uid,
                            receivedByUid: participant.uid,
                            senderMessage: `The appointment for ${reason} has been updated. Please review the details`,
                            date: Timestamp.now(),
                            link: '/Appointments',
                            isRead: false,
                        }
                    );
                });

                // Add notifications for added participants
                participants.forEach(async (participant) => {
                    if (!appointment.to.some(t => t.uid === participant.uid)) {
                        await addDoc(collection(db, "notifications"), 
                            {
                                senderName: `${currentUser.firstname} ${currentUser.lastname}`,
                                senderUid: currentUser.uid,
                                receivedByUid: participant.uid,
                                senderMessage: `An appointment for ${reason} has been scheduled. Please confirm.`,
                                date: Timestamp.now(),
                                link: '/Appointments',
                                isRead: false,
                            }
                        );
                    }
                });

                // Remove notifications for removed participants
                appointment.to.forEach(async (participant) => {
                    if (!participants.some(p => p.uid === participant.uid)) {
                        await addDoc(collection(db, "notifications"), 
                            {
                                senderName: `${currentUser.firstname} ${currentUser.lastname}`,
                                senderUid: currentUser.uid,
                                receivedByUid: participant.uid,
                                senderMessage: `An appoinment for ${reason} has been removed for you.`,
                                date: Timestamp.now(),
                                link: '/Appointments',
                                isRead: false,
                            }
                        );
                    }
                });

                setIsEdit(false)
        }catch(err){
            console.log(err)
            setErr("Something went wrong! Please try again")
        }
    }

    if(currentUser.uid !== appointment.from.uid && currentUser.role !== "admin"){
        setIsEdit(false)
        return null
    }

    return (
        appointment && (<div className='p-5 relative flex flex-col' ref={ref}>
            {appointment.status === "Declined" && <p className='bg-red-500 text-white absolute top-0 left-0 rotate-[330deg] -translate-x-8 translate-y-2 scale-125 px-10 text-sm'>{appointment.status}</p>}
            <span className='absolute top-0 right-0 text-lg cursor-pointer' onClick={()=>setIsEdit(false)}>X</span>

            <label htmlFor="phonenumber">Phonenumber</label>
            <input type="text" id='phonenumber' className='border p-2 text-sm' value={phonenumber}  onChange={(e)=>setPhonenumber(e.target.value)} required/>

            <label htmlFor="date">Date</label>
            <input type="datetime-local" id="date" className='border p-2 text-sm' value={date} onChange={(e)=>setDate(e.target.value)} required disabled={appointment.status === "Declined"}/>

            <label className="" htmlFor='reason'>Reason for visit</label>
            <textarea name="" id="reason" cols="30" rows="10" className='border p-2 text-sm' value={reason} onChange={(e)=>setReason(e.target.value)} required disabled={appointment.status === "Declined"}></textarea>
            
            <div className="flex gap-4 items-center ">
                <label htmlFor="participants">Participants</label>
                <span className='text-red-500 text-sm italic'>{err}</span>
            </div>
            <input type="email" id='search' className='border p-2 text-sm' value={search} onChange={(e)=> setSearch(e.target.value)} onKeyDown={handleKey} placeholder='Enter Email Address...'/>
            <div className='flex gap-2 text-sm my-2'>
                {participants.map((participant, key) => {
                    const handleDelete = () => {
                        setParticipants(prevParticipants => prevParticipants.filter(p => p.email !== participant.email));
                        setTo(prev => prev.filter(p => p.uid !== participant.uid))
                    };
                    return <div className="" key={key}>
                        <p className='bg-neutral-200 rounded-full py-1 px-2 cursor-pointer text-black' onClick={handleDelete}>{participant.email}
                            <BsX className='inline'/>
                        </p>
                    </div>
                })}
            </div>
            <label htmlFor="">Status</label>
            <select name="" id="" className="text-sm border p-2 my-1" value={status} onChange={e => setStatus(e.target.value)} disabled={appointment.status === "pending" || appointment.status === "Declined"}>
                <option value="Cancelled" className="">Cancelled</option>
                <option value="Rescheduled" className="">Rescheduled</option>
                <option value="Onhold" className="">Onhold</option>
                <option value="Ongoing" className="">OnGoing</option>
                <option value="No Show" className="">No Show</option>
                <option value="Completed" className="">Completed</option>
                <option value="Incoming" className="">Incoming</option>
            </select>

            <button className='p-3 bg-amber-400 my-2 hover:bg-amber-600 text-white' onClick={handleUpdate}>Update Appointment</button>
        </div>)
    )
}




export default UpdateForm
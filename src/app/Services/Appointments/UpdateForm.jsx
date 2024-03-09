'use client'
import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { addDoc, collection, doc, setDoc, query, where, getDocs, getDoc, updateDoc } from 'firebase/firestore';
import React, { useContext, useRef, useState, useEffect } from 'react'

const UpdateForm = ({setIsEdit, id}) => {

    const ref = useRef();
    
    const [err, setErr] = useState("")
    const [appointment, setAppointment] = useState(null)

    const [phonenumber, setPhonenumber] = useState('');
    const [date, setDate] = useState(null );
    const [reason, setReason] = useState('');
    const [status, setStatus] = useState('');

    const handleUpdate = async() =>{
        try{
            await updateDoc(doc(db, "appointments", id[0]), {reason: reason, date: date});
            window.location.reload();
        }catch(err){
            console.log(err)
            setErr("Something went wrong! Please try again")
        }
    }

    const fetchData = async() =>{
        const docRes = await getDoc(doc(db, "appointments", id[0]));
        
        setAppointment(docRes.data())
        setPhonenumber(docRes.data().phonenumber)
        setDate(docRes.data().date)
        setReason(docRes.data().reason)
        setStatus(docRes.data().status)
    }

    useEffect(()=>{
        fetchData();
        

    }, [id, setIsEdit])

    console.log(appointment)

    return (
        appointment && (<div className='p-5 relative flex flex-col w-96' ref={ref}>
            <h1 className='text-lg font-bold text-center p-3'>{appointment.to.position}</h1>
            {appointment.status === "Declined" && <p className='bg-red-500 text-white absolute top-0 left-0 rotate-[330deg] -translate-x-8 translate-y-2 scale-125 px-10 text-sm'>{appointment.status}</p>}
            <span className='absolute top-0 right-0 text-lg cursor-pointer' onClick={()=>setIsEdit(false)}>X</span>

            <label htmlFor="phonenumber">Phonenumber</label>
            <input type="text" id='phonenumber' className='border p-2 text-sm' value={phonenumber}  onChange={(e)=>setPhonenumber(e.target.value)} required disabled/>

            <label htmlFor="date">Date</label>
            <input type="datetime-local" id="date" className='border p-2 text-sm' value={date} onChange={(e)=>setDate(e.target.value)} required disabled={appointment.status === "Declined"}/>

            <label className="" htmlFor='reason'>Reason for visit</label>
            <textarea name="" id="reason" cols="30" rows="10" className='border p-2 text-sm' value={reason} onChange={(e)=>setReason(e.target.value)} required disabled={appointment.status === "Declined"}></textarea>

            <select name="" id="" className="text-sm border p-2 my-1" value={status} disabled={appointment.status === "pending" || appointment.status === "Declined"}>
                <option value={appointment.status} className="">{appointment.status}</option>
                <option value="cancelled" className="">Cancelled</option>
                <option value="rescheduled" className="">Rescheduled</option>
                <option value="onhold" className="">Onhold</option>
                <option value="ongoing" className="">On Going</option>
                <option value="noshow" className="">No Show</option>
                <option value="completed" className="">Completed</option>
            </select>

            <button className='p-3 bg-amber-400 my-2 hover:bg-amber-600 text-white' onClick={handleUpdate}>Update Appointment</button>
        </div>)
    )
}




export default UpdateForm
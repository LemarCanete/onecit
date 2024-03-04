import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useContext, useRef, useState } from 'react'

const Form = ({setIsOpen, name, to}) => {
    const ref = useRef();
    const [phonenumber, setPhonenumber] = useState("");
    const [date, setDate] = useState(null);
    const [reason, setReason] = useState("");
    const {currentUser} = useContext(AuthContext)
    console.log(currentUser)

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
            const {firstname, lastname, email, program, role, schoolid} = currentUser;
            const appointment = await addDoc(collection(db, "appointments"), 
                {phonenumber, date, reason, status: "pending", to: to, position: name, from:{firstname, lastname, email, program, role, schoolid}})
                setIsOpen(false)
            console.log(appointment)
        }catch(err){
            console.log(err)
        }
    }

    return (
        <form className='p-5 relative flex flex-col w-96' ref={ref}>
            <h1 className='text-lg font-bold text-center p-3'>{name}</h1>

            <span className='absolute top-0 right-0 text-lg cursor-pointer' onClick={()=>setIsOpen(false)}>X</span>

            <label htmlFor="phonenumber">Phonenumber</label>
            <input type="text" id='phonenumber' className='border p-2 text-sm' onChange={(e)=>setPhonenumber(e.target.value)} required/>

            <label htmlFor="date">Date</label>
            <input type="datetime-local" id="date" className='border p-2 text-sm' onChange={(e)=>setDate(e.target.value)} required/>

            <label className="" htmlFor='reason'>Reason for visit</label>
            <textarea name="" id="reason" cols="30" rows="10" className='border p-2 text-sm' onChange={(e)=>setReason(e.target.value)} required></textarea>

            <button className='p-3 bg-amber-400 my-2 hover:bg-amber-600 text-white' onClick={handleSubmit}>Book Now</button>
        </form>
    )
}

export default Form
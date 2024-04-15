import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { addDoc, collection, doc, setDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import React, { useContext, useRef, useState } from 'react'

const Form = ({setIsOpen, name, emailTo}) => {

    const ref = useRef();
    const [phonenumber, setPhonenumber] = useState("");
    const [date, setDate] = useState(null);
    const [reason, setReason] = useState("");
    const {currentUser} = useContext(AuthContext)
    const [step, setStep] = useState((name === "People") ? 1 : 2);
    const [search, setSearch] = useState(null);
    const [searchExist, setSearchExist] = useState(false)
    const [people, setPeople] = useState("")
    const [err, setErr] = useState("")
    const [peopleData, setPeopleData] = useState({});

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
            const {firstname, lastname, email, program, role, schoolid, uid} = currentUser;
            const appointment = await addDoc(collection(db, "appointments"), 
                {phonenumber, date, reason, status: "pending", 
                    to: {email: emailTo || people, position: name}, 
                    from:{firstname, lastname, email, program, role, schoolid}})
            const notification = await addDoc(collection(db, "notifications"), 
                {
                    senderName: `${firstname} ${lastname}`,
                    senderUid: uid,
                    receivedByUid: peopleData.uid,
                    senderMessage: "has scheduled an appointment with you. Please confirm.",
                    date: Timestamp.now(),
                    link: '/Services/Appointments',
                    isRead: false,
                }
            )
            setIsOpen(false)
        }catch(err){
            console.log(err)
        }
    }
    console.log(emailTo)
    const handleSearch = async() =>{
        const q = query(collection(db, "users"), where("email", "==", search));

        const querySnapShot = await getDocs(q);
        if(!querySnapShot.empty){
            querySnapShot.forEach(doc => {
                console.log(doc.data());
                setPeopleData(doc.data());
            })
            setSearchExist(true)
            setPeople(search)
            setErr("")
        }else{
            setSearchExist(false)
            setErr("User does not exist!")
        }
    }
    const handleKey = (e) =>{
        e.key === "Enter" && handleSearch();
    }
    console.log(searchExist)
    return (
        step === 2 ? (
            <div className='p-5 relative flex flex-col w-96' ref={ref}>
                <h1 className='text-lg font-bold text-center p-3'>{name}</h1>

                <span className='absolute top-0 right-0 text-lg cursor-pointer' onClick={()=>setIsOpen(false)}>X</span>

                <label htmlFor="phonenumber">Phonenumber</label>
                <input type="text" id='phonenumber' className='border p-2 text-sm' onChange={(e)=>setPhonenumber(e.target.value)} required/>

                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" className='border p-2 text-sm' onChange={(e)=>setDate(e.target.value)} required/>

                <label className="" htmlFor='reason'>Reason for visit</label>
                <textarea name="" id="reason" cols="30" rows="10" className='border p-2 text-sm' onChange={(e)=>setReason(e.target.value)} required></textarea>

                <button className='p-3 bg-amber-400 my-2 hover:bg-amber-600 text-white' onClick={handleSubmit}>Book Now</button>
            </div>
        ) : (
            <div className='p-5 relative flex flex-col w-96' ref={ref}>
                <label htmlFor="search">Search People</label>
                <input type="email" id='search' className='border p-2 text-sm' onChange={(e)=> setSearch(e.target.value)} onKeyDown={handleKey} required placeholder='Enter Email Address...'/>
                <span className='text-red-500'>{err}</span>
                <button className={`self-end py-3 ${searchExist ? 'underline cursor-pointer' : 'text-slate-50'} `} onClick={()=>setStep(2)} disabled={!searchExist} >Next</button>
            </div>
        )
    )
}




export default Form
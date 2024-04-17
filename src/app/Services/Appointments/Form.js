import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { addDoc, collection, doc, setDoc, query, where, getDocs, Timestamp, arrayUnion } from 'firebase/firestore';
import React, { useContext, useRef, useState } from 'react'
import { BsX } from 'react-icons/bs';

const Form = ({setIsOpen, name, emailTo}) => {

    const ref = useRef();
    const [phonenumber, setPhonenumber] = useState("");
    const [date, setDate] = useState(null);
    const [reason, setReason] = useState("");
    const [location, setLocation] = useState('');
    const {currentUser} = useContext(AuthContext)
    const [step, setStep] = useState((name === "People") ? 1 : 2);
    const [search, setSearch] = useState("");
    const [err, setErr] = useState("")
    const [participants, setParticipants] = useState([]);

    const handleSubmit = async(e) =>{
        if(date === null) return;
        e.preventDefault()
        try{
            const {uid, firstname, lastname, role} = currentUser
            const appointment = await addDoc(collection(db, "appointments"), 
                {phonenumber, date, reason, location, status: "Incoming", 
                    from: {
                        uid: uid, 
                    },
                    to: participants.map(participant => ({uid: participant.uid, status: participant.status})), 
                    }
                )
            // add notification
            participants.map(async(participant) => {
                const notification = await addDoc(collection(db, "notifications"), 
                    {
                        senderName: `${firstname} ${lastname}`,
                        senderUid: uid,
                        receivedByUid: participant.uid,
                        senderMessage: "has scheduled an appointment with you. Please confirm.",
                        date: Timestamp.now(),
                        link: '/Services/Appointments',
                        isRead: false,
                    }
                )
            })

        
            const addSubEvent = await addDoc(collection(db, "calendarEvents"),
                {value: {startDate: date, endDate: date}, title: reason, user: uid, role}
            )
            
            setIsOpen(false)
        }catch(err){
            console.log(err.message)
        }
    }
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
    return (
        step === 2 ? (
            <div className='p-5 relative flex flex-col w-96' ref={ref}>
                <h1 className='text-lg font-bold text-center p-3'>{name}</h1>

                <span className='absolute top-0 right-0 text-lg cursor-pointer' onClick={()=>setIsOpen(false)}>X</span>

                <label htmlFor="phonenumber">Phonenumber</label>
                <input type="text" id='phonenumber' className='border p-2 text-sm' onChange={(e)=>setPhonenumber(e.target.value)} required/>

                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" className='border p-2 text-sm' onChange={(e)=>setDate(e.target.value)} required/>

                <label htmlFor="location">Location</label>
                <input type="text" id='location' className='border p-2 text-sm' onChange={(e)=>setLocation(e.target.value)} required/>

                <label className="" htmlFor='reason'>Reason for visit</label>
                <textarea name="" id="reason" cols="30" rows="10" className='border p-2 text-sm' onChange={(e)=>setReason(e.target.value)} required></textarea>

                <button className='p-3 bg-amber-400 my-2 hover:bg-amber-600 text-white' onClick={handleSubmit}>Book Now</button>
            </div>
        ) : (
            <div className='p-5 relative flex flex-col w-96' ref={ref}>
                <label htmlFor="search">Search People</label>
                <input type="email" id='search' className='border p-2 text-sm' value={search} onChange={(e)=> setSearch(e.target.value)} onKeyDown={handleKey} required placeholder='Enter Email Address...'/>
                <div className='flex gap-2 text-sm my-2 flex-wrap'>
                {participants.map(participant => {
                    const handleDelete = () => {
                        setParticipants(prevParticipants => prevParticipants.filter(p => p.schoolid !== participant.schoolid));
                    };
                    return (
                        <p className='bg-neutral-200 rounded-full py-1 px-2 cursor-pointer'>{participant.schoolid} 
                            <BsX className='inline' onClick={handleDelete}/>
                        </p>
                    )
                })}
                </div>
                <span className='text-red-500'>{err}</span>
                <button className={`self-end py-3 ${participants.length !== 0 ? 'underline cursor-pointer' : 'text-slate-50'} `} onClick={()=>setStep(2)} disabled={participants.length === 0}>Next</button>
            </div>
        )
    )
}




export default Form
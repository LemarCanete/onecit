import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { collection, doc, getDoc, getDocs, or, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import Appointment from './Appointment';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const {currentUser} = useContext(AuthContext);

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const querydata = query(collection(db, "appointments"),
                    or(where("from.email", "==", currentUser.email), where("to", "==", currentUser.email)))

                const querySnapshot = await getDocs(querydata)
                
                querySnapshot.forEach((doc)=>{
                    setAppointments(prev => [doc.data(), ...prev])
                })
                
            } catch (err) {
                console.error(err);
            }
          };
          fetchData();
    }, [currentUser.email])

    console.log(appointments)

    return (
        <div className=''>
            <h1 className='text-lg'>My Appointments</h1>
            <table className="border">
                <tr className="">
                    <th className="">From</th>
                    <th className="">Contact</th>
                    <th className="">Appointment</th>
                    <th className="">To</th>
                    <th className="">Status</th>
                    <th className=""></th>
                </tr>
                {appointments.map((n, key) => <Appointment key={key} data={n}/>)}
            </table>
        </div>
  )
}


export default Appointments
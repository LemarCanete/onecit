'use client'
import React, { useEffect, useState, useContext } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import PersonalDetails from './PersonalDetails'
import { AuthContext } from '@/context/AuthContext'
import { doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase-config'
import Password from './Password'

const header = [
    {
        name: "Personal Details"
    },
    {
        name: "Password",
    },
    {
        name: "Security",
    },
    {
        name: "Delete Account"
    }
]

const page = () => {
    const [selected, setSelected] = useState("Personal Details");
    const {currentUser} = useContext(AuthContext)
    const [userData, setUserData] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Construct the correct path to the document
                const userRef = doc(db, 'users', currentUser.uid);
                const q = await getDoc(userRef);
    
                if (q.exists()) {
                    setUserData(q.data());
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };
    
        fetchData();
    }, [currentUser]);
    

    const renderHead = ()=>{
        if(selected === "Personal Details"){
            return <PersonalDetails userData={userData}/>
        }else if(selected === "Password"){
            return <Password />
        }
    }

    return (
        <div className='w-full h-screen flex bg-neutral-100 '>
            <NavbarIconsOnly />
            <div className='grow px-10 py-5 text-sm bg-white rounded-xl m-10'>
                <h1 className="text-2xl font-bold tracking-wide">Account Settings</h1>
                
                <div className="w-full flex gap-3 border-b ">
                    {selected && header.map((head, key)=>{
                        return <button className={`${(selected === head.name) ? 'border-b text-teal-500' : ''} py-3`} key={key} onClick={()=>setSelected(head.name)}>{head.name}</button>
                    })}
                </div>
                
                {userData && renderHead()}

            </div>
        </div>
    )
}

export default page

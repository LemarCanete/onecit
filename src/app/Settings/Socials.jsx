import React, { useState } from 'react'
import { SiFacebook, SiGithub, SiGmail, SiInstagram, SiMicrosoft } from "react-icons/si";
import { doc, setDoc, updateDoc } from "firebase/firestore"; 
import { db } from '@/firebase-config';

const socialComponents = [
    {
        name: 'Gmail',
        icon: <SiGmail />
    },
    {
        name: 'Facebook',
        icon: <SiFacebook />
    },
    {
        name: 'Github',
        icon: <SiGithub />
    },
    {
        name: 'Microsoft',
        icon: <SiMicrosoft />
    },
    {
        name: 'Instagram',
        icon: <SiInstagram />
    },

]

const Socials = ({userData}) => {
    const [socialAccounts, setSocialAccounts] = useState(userData?.socials || 
        {
            Gmail: "",
            Facebook: "",
            Github: "",
            Microsoft: "",
            Instagram: "",
        }
    )
    
    const handleUpdateSocials = async() =>{
        try{
            await updateDoc(doc(db, 'users', userData.uid), {socials: socialAccounts});
            alert("Updated Successfully!")
        }catch(err){
            alert('error: ' + err.message)
        }
    }
    return (
        <div className="">
            <div className='divide-y'>
                {socialComponents.map((social, id)=>{
                    const name = social.name;
                    return <div className='text-sm py-5  flex items-center text-sm text-neutral-500 gap-5' key={id}>
                        <p className="text-2xl">{social.icon}</p>
                        <label className="" htmlFor={name}> {name}</label>
                        <input type="text" className='border px-2 py-1 w-72' id={name} value={socialAccounts[name] || ''} onChange={e => setSocialAccounts({ ...socialAccounts, [name]: e.target.value })} />
                    </div>
                })}
            </div>
            <button className='bg-teal-500 text-white px-3 py-2 w-52 mt-48' onClick={handleUpdateSocials}>Save</button>
        </div>
        
    )
}

export default Socials
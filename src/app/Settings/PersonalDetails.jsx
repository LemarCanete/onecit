import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import React, { useState } from "react"

const formatDate = (dateString) => {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
};

const PersonalDetails = ({userData}) => {
    const [firstname, setFirstname] = useState(userData.firstname)
    const [lastname, setLastname] = useState(userData.lastname)
    const [email, setEmail] = useState(userData.email)
    const [birthdate, setBirthdate] = useState(formatDate(userData.birthdate));
    const [role, setRole] = useState(userData.role)
    const [program, setProgram] = useState(userData.program)
    const [schoolid, setSchoolid] = useState(userData.schoolid)
    const [bio, setBio] = useState(userData.bio)


    const handleUpdate = async() =>{
        const q = doc(db, "users", userData.uid);

        await updateDoc(q, {
            firstname: firstname,
            lastname: lastname,
            email: email,
            program: program,
            schoolid: schoolid,
            bio: bio,
        });
    }

    return (
        <div className='my-4 text-sm flex h-5/6'>
            <div className="w-4/12 border-e h-full pe-4">
                <h1 className="font-semibold text-base">Profile Picture</h1>
                <img src='./schoolLogo.png' className='w-3/6 mx-auto'/>

                <div className="mt-10">
                    <p className="py-3">Saved Pictures</p>
                    <div className="grid grid-cols-6 gap-1">
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                        <img src='./schoolLogo.png' className='cursor-pointer border'/>
                    </div>
                </div>
            </div>
            <div className="grow px-3">
                <div className="mb-5">
                    <h1 className="text-base font-semibold">Personal Details</h1>
                    <p className="text-black/50">Update your photo and personal details here</p>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5">
                    <p className="">Name</p>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Firstname' value={firstname} onChange={(e)=> setFirstname(e.target.value)}/>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Lastname' value={lastname} onChange={(e)=> setLastname(e.target.value)}/>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5">
                    <p className="">School ID</p>
                    <input type="text" className="border p-2 rounded-lg"  value={schoolid} disabled/>
                    <p className="">Role</p>
                    <input type="text" className="border p-2 rounded-lg"  value={role} disabled/>
                </div>
                <hr />
                <div className="grid grid-cols-3 my-5">
                    <p className="">Email Address</p>
                    <input type="email" className="border p-2 rounded-lg" placeholder='Email Address' value={email} onChange={(e)=> setEmail(e.target.value)}/>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5">
                    <p className="">Program</p>
                    <input type="text" className="border p-2 rounded-lg"  value={program} onChange={(e)=> setProgram(e.target.value)}/>
                    <p className="">Birth Date</p>
                    <input type="date" className="border p-2 rounded-lg"  value={birthdate} onChange={(e)=> setBirthdate(e.target.value)}/>
                    
                </div>
                <hr />
                <div className="flex w-full justify-between my-5">
                    <p className="">Bio</p>
                    <textarea name="" id="" cols="120" rows="4" className='border resize-none p-2 rounded-lg' value={bio} onChange={(e)=> setBio(e.target.value)}></textarea>
                </div>

                <button className="float-right bg-teal-500 px-5 rounded-lg text-white py-2" onClick={handleUpdate}>Save</button>
            </div>
            
        </div>
    )
}

export default PersonalDetails
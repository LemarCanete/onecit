import React from "react"
import { BsLockFill } from "react-icons/bs";


const PersonalDetails = ({userData}) => {
    const {firstname, lastname, email, birthdate, role, program,  schoolid, bio} = userData;
    if(userData?.profileView === 'private'){
        return (
            <div className="w-56 h-36 flex flex-col items-center justify-around">
                <h1 className="text-xl tracking-wide text-center">Profile is in private mode</h1>
                <BsLockFill className="text-6xl " color="gray"/>
            </div>
        )
    }

    return (
        <div className='my-4 text-sm flex h-5/6'>
            <div className="w-96 border-e h-full pe-4">
                <h1 className="font-semibold text-base">Profile Picture</h1>
                <div className="flex flex-col justify-center">
                    <label htmlFor="profile"  className="cursor-pointer w-full mx-auto">
                        <img src={userData.photoURL ? userData.photoURL : '/schoolLogo.png'} className='w-48 h-48 mx-auto rounded-full' id="profile" alt="Profile" />
                    </label>
                </div>

                <div className="mt-10">
                    <p className="py-3">Socials</p>
                    <div className="grid grid-cols-6 gap-1">
                        {userData.socials && (
                            <div className="">
                                <p className="cursor-pointer text-blue-500 hover:underline">{userData.socials.Facebook}</p>
                                <p className="cursor-pointer text-blue-500 hover:underline">{userData.socials.Github}</p>
                                <p className="cursor-pointer text-blue-500 hover:underline">{userData.socials.Gmail}</p>
                                <p className="cursor-pointer text-blue-500 hover:underline">{userData.socials.Instagram}</p>
                                <p className="cursor-pointer text-blue-500 hover:underline">{userData.socials.Microsoft}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="grow px-3">
                <div className="mb-5">
                    <h1 className="text-base font-semibold">Personal Details</h1>
                    <p className="text-black/50">Update your photo and personal details here</p>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5 py-2">
                    <p className="">Name:</p>
                    <p type="text" className="rounded-lg">{firstname} {lastname}</p>
                    <p className="">Year:</p>
                    <p type="text" className="rounded-lg">{userData?.year}</p>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-0 my-5 py-2">
                    <p className="">School ID:</p>
                    <p type="text" className="rounded-lg" >{schoolid}</p>
                    <p className="">Role:</p>
                    <p type="text" className="rounded-lg" >{role}</p>
                </div>
                <hr />
                <div className="grid grid-cols-3 my-5 py-2">
                    <p className="">Email Address:</p>
                    <p type="email" className="rounded-lg">{email}</p>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5 py-2">
                    <p className="">Program:</p>
                    <p type="text" className="rounded-lg" >{program}</p>
                    <p className="">Birth Date:</p>
                    <p type="date" className="rounded-lg" >{birthdate}</p>
                    
                </div>
                <hr />
                <div className="flex w-full mt-5 gap-5 py-2">
                    <p className="">Bio:</p>
                    <textarea name="" id="" cols="125" rows="4" className='resize-none rounded-lg' value={bio} disabled></textarea>
                </div>

            </div>
            
        </div>
    )
}

export default PersonalDetails
import React, { useContext } from 'react'
import { BiSolidPhone, BiSolidUserCircle, BiX } from 'react-icons/bi'
import { profileToggle } from './GloabalRedux/Features/showProfileSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AuthContext } from '@/context/AuthContext'
import { SiFacebook, SiGmail, SiInstagram, SiLinkedin, SiMicrosoft, SiTwitter } from "react-icons/si";


function calculateAge(bday) {
    const dob = new Date(bday);

    const currentDate = new Date();

    let age = currentDate.getFullYear() - dob.getFullYear();

    if (
        currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() &&
            currentDate.getDate() < dob.getDate())
    ) {
        age--;
    }

    return age;
}

const Profile = () => {
    const mode = useSelector(state => state.darkMode.value)
    const dispatch = useDispatch();
    const {currentUser} = useContext(AuthContext)
    return (
        <div className={`h-screen w-3/12 relative p-4 shadow-lg overflow-y-scroll ${mode ? 'bg-slate-600 text-white' : 'bg-white'}`}>
            <BiX className='absolute right-0 top-0 text-5xl cursor-pointer ' onClick={()=>dispatch(profileToggle())}/>
            <div className="flex flex-col justify-center items-center py-5">
                <h1 className='text-3xl font-bold tracking-widest'>Profile</h1>
                <div className="">
                    <img src={currentUser.photoURL ? currentUser.photoURL : './schoolLogo.png'} alt="" className='h-60 w-60 rounded-full'/>
                </div>
                <p className='mt-4'>{currentUser.schoolid}</p>
            </div>
            <hr />
            {/* <div className="grid grid-cols-3 text-sm text-center py-2">
                <div className="">
                    <h3 className="font-bold">100</h3>
                    <p className="">POSTS</p>
                </div>

                <div className="">
                    <h3 className="font-bold">100k</h3>
                    <p className="">POSTS</p>
                </div>

                <div className="">
                    <h3 className="font-bold">100k</h3>
                    <p className="">FOLLOWERS</p>
                </div>
            </div> */}
            <p className="my-2 text-center italic text-sm">{currentUser.bio}</p>
            <div className="text-sm leading-loose tracking-wider mt-12 mx-6">
                {/* <h2 className="text-lg font-n">Basic Info</h2> */}
                <p className='pb-2'><span className="font-bold">Name:</span> {currentUser.firstname} {currentUser.lastname}</p>
                <p className='pb-2'><span className="font-bold">Age:</span> {calculateAge(currentUser.birthdate)}</p>
                <p className='pb-2'><span className="font-bold">Email:</span> {currentUser.email}</p>
                <p className='pb-2'><span className="font-bold">Birth Date:</span> {currentUser.birthdate}</p>
                <p className='pb-2'><span className="font-bold">Role:</span> {currentUser.role}</p>
                <p className='pb-2'><span className="font-bold">Program:</span> {currentUser.program}</p>
            </div>

            {/* <div className="text-sm tracking-wider leading-loose mt-5">
                <h1 className="text-xl">Achievements & Certificates</h1>
            </div>

            <div className="text-sm tracking-wider leading-loose mt-5">
                <h1 className="text-xl">Work Experience</h1>
            </div> */}
            
            <hr className='mt-14'/>
            <div className="grid grid-cols-4 w-full mb-4 text-2xl absolute bottom-0 left-0 place-items-center">
                <hr className='col-span-4'/>
                <button className="text-blue-600 "><a href={currentUser.socials.Facebook} target='_blank'><SiFacebook /></a></button>
                <button className="text-red-500 "><a href={`mailto: ${currentUser.socials.Gmail}`} target='_blank'><SiGmail /></a></button>
                <button className="text-blue-500 "><a href={currentUser.socials.LinkedIn} target='_blank'><SiLinkedin /></a></button>
                {/* {currentUser.socials.Phone && <button className="text-green-500"><a href={`mailto: ${currentUser.socials.Phone}`}><BiSolidPhone /></a></button>} */}
                <button className="text-pink-700 "><a href={currentUser.socials.Instagram} target='_blank'><SiInstagram /></a></button>
                {/* {currentUser.socials.Microsoft && <button className="text-pink-700"><a href={`mailto: ${currentUser.socials.Microsoft}`} target='_blank'><SiMicrosoft /></a></button>} */}
            </div>

        </div>
    )
}

export default Profile
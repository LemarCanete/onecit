import React, { useContext } from 'react'
import { BiSolidUserCircle, BiX } from 'react-icons/bi'
import { profileToggle } from './GloabalRedux/Features/showProfileSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AuthContext } from '@/context/AuthContext'

const Profile = () => {
    const mode = useSelector(state => state.darkMode.value)
    const dispatch = useDispatch();
    const {currentUser} = useContext(AuthContext)
    return (
        <div className={`h-screen w-3/12 flex flex-col items-center relative p-4 shadow-xl ${mode ? 'bg-slate-600 text-white' : 'bg-white'}`}>
            <BiX className='absolute right-0 top-0 text-5xl cursor-pointer ' onClick={()=>dispatch(profileToggle())}/>
            <h1 className='text-3xl font-bold'>Profile</h1>
            <div className=""><BiSolidUserCircle className='text-9xl'/></div>
            <p>{currentUser.schoolid}</p>
            <p>{currentUser.email}</p>
            <p>{currentUser.firstname}</p>
            <p>{currentUser.lastname}</p>
            <p>{currentUser.birthdate}</p>
            <p>{currentUser.role}</p>
            <p>{currentUser.program}</p>

        </div>
    )
}

export default Profile
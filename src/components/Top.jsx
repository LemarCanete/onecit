'use client'
import React from 'react'
import { BiSolidBell, BiSolidMoon, BiSolidSun, BiSolidUserCircle } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import {toggle} from '@/components/GloabalRedux/Features/darkModeSlice'
import { profileToggle } from './GloabalRedux/Features/showProfileSlice'

const Top = () => {
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    const dispatch = useDispatch()
    console.log(profile)
    return (
        <div className="w-full flex justify-between items-center">
            <input type="search" className='grow rounded-lg p-2 ps-5' placeholder='Search'/>
            <div className="">
                <div className="inline bg-white rounded-lg p-2 mx-5 cursor-pointer" onClick={()=>dispatch(toggle())}>
                    {mode ? <BiSolidSun className='inline text-teal-800 text-2xl'/> : <BiSolidMoon className='inline text-teal-800 text-2xl'/>}
                </div>
                <div className={`inline bg-white rounded-lg p-2 cursor-pointer ${!profile && 'me-44'}`}><BiSolidBell className='inline text-teal-800 text-2xl'/></div>
                {!profile && <div className="inline bg-white rounded-lg p-2 cursor-pointer" onClick={()=> dispatch(profileToggle())}>
                    <BiSolidUserCircle className='inline text-teal-800 text-3xl'/>
                </div>}
            </div>
        </div>
    )
}

export default Top
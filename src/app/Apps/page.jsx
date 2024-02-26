'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Profile from '@/components/Profile'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'

const page = () => {
    const mode = useSelector(state => state.darkMode.value)
    const profile = useSelector(state => state.profile.value)
    return (
        <div className={`w-full  h-screen flex ${mode ? 'bg-slate-800' : 'bg-neutral-50'}`}>
            <Navbar active="Apps"/>
            <div className="grow px-10 py-5">
                <h1 className="text-2xl my-5">Apps</h1>
                {/* Content */}
                <div className="flex">
                    <div className="w-5/6 grid grid-cols-6 ">
                        <Box name="Directory"/>
                        <Box name="Services"/>
                        <Box name="Library"/>
                        <Box name="Personal Details"/>
                        <Box name="Chat"/>
                        <Box name="Task Management"/>
                        <Box name="Announcements"/>
                        <Box name="Calendar of Events"/>
                        <Box name="Forum"/>
                        <Box name="Feedback and Complaints"/>
                        <Box name="Careers"/>
                        <Box name="Grade Calculator"/>
                        <Box name="Class Tracker"/>
                        <Box name="Courses"/>
                    </div>

                    <div className="rows-span-5 bg-white h-full">
                        <div class="quick-container">
                            <ul>
                                <p class="quick-links">Quick Links:</p>
                                <li><a href="https://www.youtube.com/watch?v=cEZ1t7h3oio&feature=youtu.be">Self Enrollment Tutorial Video</a></li><hr/>
                                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSe5-t8z-q7mczgOOJmY0VbY_CCfqM7AT_XA_CBiWaoSxAyxXA/viewform">Shifting to another program</a></li><hr/>
                                <li><a href="https://docs.google.com/spreadsheets/d/1YJHKsIOVaH-Rub6sZ_nDG63spLdY7VZH0nxKySoAA-0/edit#gid=0">Changing/Adding/<br/>Dropping of courses</a></li><hr/>
                                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSdLnQdDAFxSWSvd7PEEDUddo5LAjRqAwDgHvMW_hvAyyHuIHQ/viewform">Request to overload units</a></li><hr/>
                                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSffnM0Wka1NwlvRQLtIfnbvh72ia9vc4RUmtSFHL9t7BlHmDA/viewform">Proof of PAYMENT</a></li><hr/>
                                <li><a href="https://docs.google.com/forms/d/e/1FAIpQLSc-HhiYXZ-oArnUvllNGxMHfbCe1WVdfCq1hN2e5p-2y1yAEw/viewform">Request of documents from <br/>the University Registrar</a></li><hr/>
                                <li><a href="#">Course Accreditation</a></li><hr/>
                                <li><a href="#">Request for Good Moral <br/> Certificate</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                

            </div>
            {profile && <Profile />}
        </div>
    )
}

const Box = ({image, name}) =>{
    const router = useRouter()

    return (
        <div className="flex justify-center flex-col border rounded-lg w-40 h-36 items-center m-2 bg-white cursor-pointer text-center" onClick={() => router.push(`/${name}`)}>
            <img src="schoolLogo.png" alt="" className='w-20 h-20'/>
            <p className='text-sm m-1'>{name}</p>
        </div>
    )
}

export default page
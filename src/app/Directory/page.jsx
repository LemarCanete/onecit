'use client'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import React from 'react'
import { useRouter } from 'next/navigation'

const page = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>
            <div className="px-10 py-5 grow">
                <h1 className="text-3xl">Directory</h1>
                <input type="search" placeholder='Search' className='w-full rounded-lg p-2 my-3'/>

                <div className="">
                    <p className='mt-10 italic '>Results</p>
                    <div className="border">
                        <Result name="Lemar Canete"/>
                    </div>
                </div>
            </div>

        </div>
    )
}

const Result = ({name, position}) => {
    const router = useRouter();
    return(
        <div className="bg-white shadow p-2 cursor-pointer text-sm" onClick={() => router.push("/Directory2")}>
            <h3 className='font-bold'>{name}</h3>
            <p className=''>{position || "President> College of Engineering and Architecture> Student"}</p>
        </div>
    )
}

export default page
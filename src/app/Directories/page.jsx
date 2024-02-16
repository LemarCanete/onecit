'use client'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import React from 'react'

const page = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>
            <div className="px-10 py-5 grow">
                <h1 className="text-3xl">Directory</h1>
                <input type="search" placeholder='Search' className='w-full rounded-lg p-2 my-3'/>

                <div className="">
                    <p className='mt-10 italic '>Results</p>
                </div>
            </div>

        </div>
    )
}

export default page
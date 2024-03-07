'use client'
import React from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'

const page = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-100'>
            <NavbarIconsOnly/>
            <div className='"grow px-10 py-5'>
                <h1 className="text-2xl">Lost and Found</h1>

            </div>
        </div>
    )
}

// const Form = () =>{
//     return(
//         <div className="">
//             <input type="text" placeholder="What's on your mind?" className='rounded-2xl py-2 px-5'/>
//         </div>
//     )
// }

export default page

'use client'
import React from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import { usePathname, useRouter } from 'next/navigation'

const services = [
    {
        name: "Appointments",
        description: "rent equipments and places"
    },
    {
        name: "Rental",
        description: "rent equipments and places"
    },
    {
        name: "Inquiry",
        description: "rent equipments and places"
    },
    {
        name: "Lost and Found",
        description: "rent equipments and places"
    },
    {
        name: "Requests",
        description: "rent equipments and places"
    },
    {
        name: "Ask Advice",
        description: "rent equipments and places"
    },
    {
        name: "Security",
        description: "rent equipments and places"
    },
    {
        name: "Sports",
        description: "rent equipments and places"
    },
    {
        name: "Trainings",
        description: "rent equipments and places"
    },
    {
        name: "Shift",
        description: "rent equipments and places"
    },
    {
        name: "Scholarships",
        description: "rent equipments and places"
    },
    // {
    //     name: "Elementary",
    //     description: "rent equipments and places"
    // },
    // {
    //     name: "High School",
    //     description: "rent equipments and places"
    // },
    // {
    //     name: "Colleges",
    //     description: "rent equipments and places"
    // },
    // {
    //     name: "Alumni",
    //     description: "rent equipments and places"
    // },
    {
        name: "Offices",
        description: "rent equipments and places"
    },
    {
        name: "Departments",
        description: "rent equipments and places"
    },
    {
        name: "Others",
        description: "rent equipments and places"
    },
]

const page = () => {

    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>

            <div className="px-10 py-5 grow flex-col justify-center items-center">
                <h1 className="text-3xl">Services</h1>
                <input type="search" placeholder='Search' className='w-full rounded-lg p-2 my-3'/>

                <div className='w-full h-auto grid grid-cols-4' >
                    {services.map((service, id)=>{
                        return(
                            <Box name={service.name} description={service.description}/>
                        )
                    })}

                </div>
            </div>

        </div>
    )
}

const Box = ({name, icon, description}) =>{
    const router = useRouter()
    const paths = usePathname()

    const formattedName = name.replace(/\s/g, '');

    return(
        <div className="" onClick={() => router.push(`${paths}/${formattedName}`)}>
            <div className="grid grid-rows-2 grid-flow-col border bg-white m-2 p-2 cursor-pointer shadow">
                <img src="schoolLogo.png" alt="" className='w-12 h-12 row-span-2'/>
                <p className=''>{name}</p>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    )
}

export default page


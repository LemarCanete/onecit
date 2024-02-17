'use client'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import Reactfrom from 'react'



const page = () => {


    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>

            <div className="px-10 py-5 grow flex-col justify-center items-center">
                <h1 className="text-3xl">Services</h1>
                <input type="search" placeholder='Search' className='w-full rounded-lg p-2 my-3'/>

                <div className='w-full h-auto grid grid-cols-4' >
                    <Box name="Rental" description="rent equipments and places"/>
                    <Box name="Security" description="rent equipments and places"/>
                    <Box name="Sports" description="rent equipments and places"/>
                    <Box name="Ask Advice" description="rent equipments and places"/>
                    <Box name="Appointments" description="rent equipments and places"/>
                    <Box name="Trainings" description="rent equipments and places"/>
                    <Box name="Shift" description="rent equipments and places"/>
                    <Box name="Scholarships" description="rent equipments and places"/>
                    <Box name="Lost and Found" description="rent equipments and places"/>
                    <Box name="Requests" description="rent equipments and places"/>
                    <Box name="Inquiry" description="rent equipments and places"/>
                    <Box name="Elementary" description="rent equipments and places"/>
                    <Box name="High School" description="rent equipments and places"/>
                    <Box name="Colleges" description="rent equipments and places"/>
                    <Box name="Alumni" description="rent equipments and places"/>
                    <Box name="Offices" description="rent equipments and places"/>
                    <Box name="Departments" description="rent equipments and places"/>
                    <Box name="Others" description="rent equipments and places"/>

                </div>
            </div>

        </div>
    )
}

const Box = ({name, icon, description}) =>{
    return(
        <div className="">
            <div className="grid grid-rows-2 grid-flow-col border bg-white m-2 p-2 cursor-pointer shadow">
                <img src="schoolLogo.png" alt="" className='w-12 h-12 row-span-2'/>
                <p className=''>{name}</p>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    )
}

export default page


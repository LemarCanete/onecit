'use client'
import React, { useContext } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import { usePathname, useRouter } from 'next/navigation'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { AuthContext } from '@/context/AuthContext';

const userServices = [
    {
        name: "Appointments",
        description: "rent equipments and places",
        isDone: true
    },
    {
        name: "Inquiry",
        description: "rent equipments and places",
        isDone: true
    },
    {
        name: "Requests",
        description: "rent equipments and places",
        isDone: true
    },
    // {
    //     name: "Lost and Found",
    //     description: "rent equipments and places",
    //     isDone: true
    // },
    // {
    //     name: "Ask Advice",
    //     description: "rent equipments and places",
    //     isDone: true
    // },
    // {
    //     name: "Campus Security",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Sports",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Trainings",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Shift",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Scholarships",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Offices",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Departments",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Others",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
    // {
    //     name: "Student Organizations",
    //     description: "rent equipments and places",
    //     isDone: false
    // },
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
]
const adminServices = [
    {
        name: "Appointments",
        description: "rent equipments and places",
        isDone: true
    },
    {
        name: "Rental",
        description: "rent equipments and places",
        isDone: false
    },
    {
        name: "Security",
        description: "rent equipments and places",
        isDone: false
    },
    {
        name: "Inquiry",
        description: "Ask a department-specific question from a list of choices.",
        isDone: true
    },
    {
        name: "Feedback and Complaints",
        description: "Let the administrators hear your thoughts.",
        isDone: true
    },
]
const Services = () => {
    const router = useRouter()
    const {currentUser} = useContext(AuthContext);

    const isAdmin = currentUser.role === "admin"
    const renderDoneApps = () =>{
        if(isAdmin){
            return adminServices.map((service)=>{
                return service.isDone && <Box name={service.name} description={service.description}/>
            })
        }else{
            return userServices.map((service)=>{
                return service.isDone && <Box name={service.name} description={service.description}/>
            })
        }
    }
    const renderNotStartedApps = () =>{
        if(isAdmin){
            return adminServices.map((service)=>{
                return !service.isDone && <Box name={service.name} description={service.description}/>
            })
        }else{
            return userServices.map((service)=>{
                return !service.isDone && <Box name={service.name} description={service.description}/>
            })
        }
    }
    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>

            <div className="px-10 py-5 grow flex-col justify-center items-center">
                <div className="flex items-center gap-10">
                    <button onClick={()=>router.back()}>
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                    </button>
                    <h1 className="text-2xl tracking-widest">Services</h1>
                </div>
                <input type="search" placeholder='Search' className='w-full rounded-lg p-2 my-3 border-b outline-none'/>

                {/* Done Working */}
                <p className="text-sm italic text-black/25">Done or Working</p>
                <div className='w-full h-auto grid grid-cols-4' >
                    {currentUser.role && renderDoneApps()}
                </div>

                {/* Not Started */}
                <p className="text-sm italic text-black/25">Not Started</p>
                <div className='w-full h-auto grid grid-cols-4' >
                    {currentUser.role && renderNotStartedApps()}
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
            <div className="flex gap-4 border bg-white m-2 p-2 cursor-pointer shadow">
                <img src="schoolLogo.png" alt="" className='w-12 h-12 row-span-2'/>
                <div className="">
                    <p className='hover:underline'>{name}</p>
                    <p className="text-sm">{description}</p>
                </div>
            </div>
        </div>
    )
}

export default Services


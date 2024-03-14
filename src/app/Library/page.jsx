'use client'
import React from 'react'
import Navbar from '@/components/Navbar'
import Results from './Results'

const page = () => {
    return (
        <div className='w-full h-screen flex bg-neutral-100'>
            <Navbar/>
            <Results />
            <div className="w-3/12 h-full bg-white py-5 px-2 flex flex-col">
                <div className="">
                    <h3 className=''>Websites</h3>
                    <input type="search" name="" id="" className="border-b focus:outline-none w-full text-sm p-2" placeholder='Search'/>
                </div>

                <div className="mt-3 overflow-y-auto h-auto">
                    <Lib title="Cambridge Core"/>
                    <Lib title="Chan Robles Online Law Library"/>
                    <Lib title="Directory of Open Access Books (DOAB)"/>
                    <Lib title="Directory of Open Access Journals (DOAJ)"/>
                    <Lib title="Emerald emerging market case studies"/>
                    <Lib title="Emerald insight electronic journals"/>
                    <Lib title="Philippine Ebook Hub"/>
                    <Lib title="Proquest eLibrary"/>
                    <Lib title="PubMed"/>
                    <Lib title="Science Direct"/>
                    <Lib title="Scientific Academic Research"/>
                    <Lib title="Springer Open"/>
                    <Lib title="Taylor & Francis Online"/>
                    <Lib title="Wiley Online Library"/>
                    <Lib title="EBSCO Academic Collection"/>
                </div>

            </div>
        </div>
    )
}

const Lib = ({title, description}) =>{
    return (
        <div className="flex gap-3 hover:bg-neutral-100 cursor-pointer p-1">
            <img src="/schoolLogo.png" alt="" className="h-12 w-12 " />
            <div className="">
                <h4 className="text-sm font-black">{title}</h4>
                <p className="text-sm">description</p>
            </div>
        </div>
    )
}

export default page

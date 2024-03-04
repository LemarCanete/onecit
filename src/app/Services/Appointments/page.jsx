'use client'
import React, { useState } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import Modal from 'react-modal'
import Form from './Form'
import Appointments from './Appointments'

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5"

    }
};

const page = () => {

    return (
        <div className={`w-full h-screen flex bg-neutral-50`}>
            <NavbarIconsOnly />
            <div className="grow px-10 py-5">
                <h1 className="text-2xl">Appointments</h1>
                <div className="w-full grid grid-cols-8">
                        <Box name="Library" to="citlibrary@gmail.com"/>
                        <Box name="Research Labs" to="citresearch@gmail.com"/>
                        <Box name="Orgs" to="citorgs@gmail.com"/>
                        <Box name="Tutoring Centers" to="cittutoring@gmail.com"/>
                        <Box name="FAO" to="citfao@gmail.com"/>
                        <Box name="Clinic" to="citclinic@gmail.com"/>
                        <Box name="Couselling" to="citcouncelling@gmail.com"/>
                        <Box name="People" />
                </div>

                <div className="">
                    <hr />
                    <Appointments />
                </div>
            </div>
        </div>
    )
}

const Box = ({image, name, to}) =>{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="">
            <div className="flex justify-center flex-col border rounded-lg w-40 h-36 items-center m-2 bg-white cursor-pointer text-center" onClick={()=>setIsOpen(true)}>
                <img src="/schoolLogo.png" alt="" className='w-20 h-20'/>
                <p className='text-sm m-1'>{name}</p>
            </div>
            <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false) } style={customStyles}>
                <Form setIsOpen={setIsOpen} name={name} to={to}/>
            </Modal>
        </div>
    )
}

export default page
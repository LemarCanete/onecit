'use client'
import React, { useState } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import Modal from 'react-modal'
import Form from './Form'

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
                <div className="w-5/6 grid grid-cols-6 ">
                        <Box name="Dental" />
                        <Box name="Clinic"/>
                        <Box name="Couselling"/>
                        <Box name="People" />
                </div>

                <div className="">
                    <hr />
                    <h1>My Appointments</h1>
                </div>
            </div>
        </div>
    )
}

const Box = ({image, name}) =>{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="">
            <div className="flex justify-center flex-col border rounded-lg w-40 h-36 items-center m-2 bg-white cursor-pointer text-center" onClick={()=>setIsOpen(true)}>
                <img src="/schoolLogo.png" alt="" className='w-20 h-20'/>
                <p className='text-sm m-1'>{name}</p>
            </div>
            <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false) } style={customStyles}>
                <Form setIsOpen={setIsOpen} name={name}/>
            </Modal>
        </div>
    )
}

export default page
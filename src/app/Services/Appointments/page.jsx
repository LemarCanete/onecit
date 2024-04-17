'use client'
import React, { useContext, useState } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import Modal from 'react-modal'
import Form from './Form'
import Appointments from './Appointments'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext'

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

Modal.setAppElement("body")

const page = () => {
    const router = useRouter();
    const {currentUser} = useContext(AuthContext)

    return (
        <div className={`w-full h-screen flex bg-neutral-50`}>
            <NavbarIconsOnly />
            <div className="grow px-10 py-5">
                <div className='flex flex-row w-full h-[45px] py-10 items-center px-2 gap-16'>
                    <button onClick={()=>router.back()}>
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                    </button>
                    
                    <h1 className="text-2xl tracking-widest	">Appointments</h1>
                </div>
                {currentUser.role && currentUser.role !== "admin" && <div className="w-full grid grid-cols-8">
                        {/* <Box name="Library" emailTo="citlibrary@gmail.com"/>
                        <Box name="Research Labs" emailTo="citresearch@gmail.com"/>
                        <Box name="Orgs" emailTo="citorgs@gmail.com"/>
                        <Box name="Tutoring Centers" emailTo="cittutoring@gmail.com"/>
                        <Box name="FAO" emailTo="citfao@gmail.com"/>
                        <Box name="Clinic" emailTo="citclinic@gmail.com"/>
                        <Box name="Couselling" emailTo="citcouncelling@gmail.com"/> */}
                        <Box name="People" />
                </div>}

                <div className="">
                    <hr />
                    <Appointments />
                </div>
            </div>
        </div>
    )
}

const Box = ({image, name, emailTo}) =>{
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="">
            <div className="flex justify-center flex-col border rounded-lg w-40 h-36 items-center m-2 bg-white cursor-pointer text-center" onClick={()=>setIsOpen(true)}>
                <img src="/schoolLogo.png" alt="" className='w-20 h-20'/>
                <p className='text-sm m-1'>{name}</p>
            </div>

            <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false) } style={customStyles}>
                <Form setIsOpen={setIsOpen} name={name} emailTo={emailTo} />
            </Modal>
        </div>
    )
}

export default page
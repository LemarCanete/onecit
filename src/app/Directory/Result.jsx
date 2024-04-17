import ProfileCard from '@/components/ProfileCard';
import React, { useState } from 'react'
import Modal from 'react-modal';
import PersonalDetails from '../Settings/PersonalDetails';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '1300px',
    //   height: '550px'
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5"

    }
};


const Result = ({name, program, user, key}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    console.log(program)
    return(
        <div className="bg-white shadow p-2 cursor-pointer text-sm " key={key}>
            <h3 className={`font-bold ${user?.uid ? 'hover:underline'  : ''}`} onClick={() => user?.uid ? setIsOpen(true) : ""}>{name}</h3>
            {/* <p className=''>{position || "President> College of Engineering and Architecture> Student"}</p> */}
            <p className="">{program ? program : user.role}</p>

            <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false) } style={customStyles}>
                <ProfileCard userData={user}/>
            </Modal>

        </div>
    )
}

export default Result
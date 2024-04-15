import { AuthContext } from '@/context/AuthContext';
import React, { useContext, useState } from 'react'
import Modal from 'react-modal'
import axios from 'axios'
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { useRouter } from 'next/navigation';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
    //   marginRight: '-30%',
      transform: 'translate(-50%, -50%)',
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5"

    }
};

const DeleteAccount = () => {
    const {currentUser} = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter()

    const handleDelete = async() =>{
        try{
            const deleteUser = await axios.delete(`http://localhost:4000/deleteUser/${currentUser.uid}`)
            await deleteDoc(doc(db, "users", currentUser.uid));
            alert(deleteUser.data);
            router.push('/');
        }catch(err){
            alert('Error: ' + err.message)
        }


    }
    return (
        <div className='text-sm py-5 border-b flex flex-col gap-1'>
            <h1 className="text-base font-semibold">Delete Account</h1>
            <p className=''>Deleting this account may Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum, laborum.</p>

            <button className="bg-red-500 px-5 rounded-lg text-white py-2 w-20" onClick={()=>setIsOpen(true)}>Delete</button>

            <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false) } style={customStyles} >
                <h1 className="mb-5">Are you sure to delete this account?</h1>
                <div className="flex justify-end gap-5">
                    <button className="bg-neutral-400 px-5 rounded-lg text-white py-2" onClick={()=>setIsOpen(false)}>Cancel</button>
                    <button className="bg-red-500 px-5 rounded-lg text-white py-2" onClick={handleDelete}>Delete</button>
                </div>
            </Modal>
        </div>
    )
}

export default DeleteAccount
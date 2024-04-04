'use client'
import React, { useEffect, useState } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase-config';
import { DataGrid  } from '@mui/x-data-grid';
import Modal from 'react-modal'
import { BsFileLock, BsGrid, BsList, BsLock, BsPen, BsPlus, BsTable, BsTrash, BsShieldLock } from 'react-icons/bs';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useRouter } from 'next/navigation';
import Form from './Form';
import axios from 'axios'
import PersonalDetails from '../Settings/PersonalDetails';
import Password from '../Settings/Password';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-30%',
      transform: 'translate(-50%, -50%)',
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5"

    }
};

Modal.setAppElement("body")

const page = () => {
    const [users, setUsers] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    const [isOpenUserDetails, setIsOpenUserDetails] = useState(false)
    const [userData, setUserData] = useState(undefined);
    const [isOpenChangePassword, setIsOpenChangePassword] = useState(false)


    const router = useRouter();

    const columns = [
        { field: 'id', headerName: 'ID', width: '300' },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            editable: true,
            valueGetter: (value) => value.row.email,
        },
        {
            field: 'lastSignInTime',
            headerName: 'Last SignIn Time',
            width: 230,
            editable: true,
            valueGetter: (value) => value.row.metadata.lastSignInTime,
        },
        {
            field: 'creationTime',
            headerName: 'Creation Time',
            width: 230,
            editable: true,
            valueGetter: (value) => value.row.metadata.creationTime,
        },
        {
            field: 'view',
            headerName: 'View',
            width: 50,
            renderCell: (params) => {
                return <button className="text-center hover:text-teal-500 mx-auto" onClick={()=> getUserData(params.id, "view")}>
                    <BsTable />
                </button>
            }
        },
        {
            field: 'password',
            headerName: 'Password',
            width: 90,
            renderCell: (params) => {
                return <button className="text-center hover:text-teal-500 mx-auto" onClick={()=> getUserData(params.id, "password")}>
                    <BsShieldLock />
                </button>
            }
        },
    ];


    useEffect(()=>{
        const fetchData = async() =>{
            try{
                const listAllUsers = await axios.get('http://localhost:4000/listAllUsers')
                console.log(listAllUsers.data)
                setUsers(listAllUsers.data)
            }catch(err){
                console.log(err)
            }
        }

        fetchData();
    }, [])

    const handleAdd = () =>{
        setIsAdd(true)
    }
    const handleUpdate = () =>{
        if(selectedRows.length > 1 || selectedRows.length < 1) return;

        setIsEdit(true)
    }

    const handleDelete = () =>{
        if(selectedRows.length < 1) {
            setIsDeleteModal(false)
            return;
        }

        // const usersToDelete = users.filter(user => selectedRows.includes(user.uid));

        // console.log(usersToDelete);
        // usersToDelete.forEach(async(user) => {
        //     await deleteUser(user).then(() => {
        //         alert("Successfully deleted")
        //       }).catch((error) => {
        //         console.log(error.message)
        //       });
              
        // })
        
        const auth = getAuth();
        const user = auth.currentUser;
        console.log(auth)

        setIsDeleteModal(false)
    }

    const getUserData = async(uid, component) =>{
        try {
            // Construct the correct path to the document
            const userRef = doc(db, 'users', uid);
            const q = await getDoc(userRef);

            if (q.exists()) {
                setUserData(q.data());
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }

        if(component === "view"){
            setIsOpenUserDetails(true)
        }else if(component === "password"){
            setIsOpenChangePassword(true)
        }
    }

    console.log(selectedRows)
    return (
        <div className='w-full h-screen flex bg-neutral-100'>
            <NavbarIconsOnly/>
            <div className='grow px-10 py-5 flex flex-col gap-5'>
                <div className="flex flex-row w-full h-[45px] py-10 items-center px-2 justify-between">
                    <button onClick={()=>router.back()}>
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                    </button>
                    <h1 className="text-2xl tracking-widest	font-bold">User Management</h1>
                    <div className="flex gap-3">
                        <p className="inline cursor-pointer bg-teal-500 rounded p-2 text-white" onClick={handleAdd}><BsPlus className='inline' /> Add</p>
                        <p className="inline cursor-pointer bg-red-500 rounded p-2 text-white" onClick={()=>setIsDeleteModal(true)}><BsTrash className='inline' /> Delete</p>
                    </div>
                </div>

                <div className="h-5/6 bg-white">
                    <DataGrid
                            rows={users}
                            columns={columns}
                            initialState={{
                            pagination: {
                                paginationModel: {
                                pageSize: 10,
                                },
                            },
                            }}
                            pageSizeOptions={[5]}
                            checkboxSelection
                            onRowSelectionModelChange={rows => setSelectedRows(rows) }
                        />
                </div>

                {/* Modals */}
                {/* <Modal isOpen={isDeleteModal} onRequestClose={()=>setIsDeleteModal(false) } style={customStyles}>
                    <h1 className="">Are you sure to delete these rows? </h1>
                    <p className="">[{selectedRows.join(', ')}] {selectedRows.length < 1 && <span className='text-red-500 italic'>No selected row</span>}</p>
                    <div className="flex justify-end mt-4 gap-3">
                        <button className="bg-neutral-100  p-3 text-sm" onClick={()=>setIsDeleteModal(false)}>Cancel</button>
                        <button className="bg-red-500 text-white p-3 inline text-sm" onClick={handleDelete}><BsTrash className='inline'/> Delete</button>
                    </div>
                </Modal> */}
                {/*<Modal isOpen={isAdd} onRequestClose={()=>setIsAdd(false) } style={customStyles} >
                    <Form title="Add"/>
                </Modal> */}
                
                <Modal isOpen={isOpenUserDetails} onRequestClose={()=>setIsOpenUserDetails(false) } style={customStyles} >
                    {userData && <div className=''>
                        <PersonalDetails userData={userData}/>    
                    </div>}
                </Modal>

                <Modal isOpen={isOpenChangePassword} onRequestClose={()=>setIsOpenChangePassword(false) } style={customStyles} >
                    {userData && <div className=''>
                        <Password userData={userData}/>    
                    </div>}
                </Modal>
                    
            </div>
        </div>
  )
}

export default page
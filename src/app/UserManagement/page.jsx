'use client'
import React, { useEffect, useState } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from '@/firebase-config';
import { DataGrid  } from '@mui/x-data-grid';
import Modal from 'react-modal'
import { BsGrid, BsList, BsPen, BsPlus, BsTrash } from 'react-icons/bs';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useRouter } from 'next/navigation';
import Form from './Form';
import { deleteUser, getAuth } from "firebase/auth";

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
    const [users, setUsers] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isAdd, setIsAdd] = useState(false)
    
    const router = useRouter();

    const columns = [
        { field: 'id', headerName: 'ID', width: '300' },
        {
            field: "schoolid",
            headerName: 'School ID',
            width: 120,
            editable: true,
        },
        {
            field: "firstname",
            headerName: 'First Name',
            width: 200,
            editable: true,
        },
        {
            field: "lastname",
            headerName: 'Last Name',
            width: 120,
            editable: true,
        },
        {
            field: "birthdate",
            headerName: 'Last Name',
            width: 120,
            editable: true,
        },
        {
            field: 'program',
            headerName: 'Program',
            width: 110,
            editable: true,
            valueGetter: (value) => value.row.program,

        },
        {
            field: 'role',
            headerName: 'Role',
            width: 110,
            editable: true,
            valueGetter: (value) => value.row.role,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 250,
            editable: true,
            valueGetter: (value) => value.row.email,
        },
    ];

    useEffect(()=>{
        const fetchData = () =>{
            try{
                const q = query(collection(db, "users"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const usersData = [];
                    querySnapshot.forEach((doc) => {
                        usersData.push({ ...doc.data(), id: doc.id});
                    });
                    setUsers(usersData)
                });
            }catch(err){

            }
        }
        fetchData()
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
                        <p className="inline cursor-pointer bg-yellow-500 rounded p-2 text-white" onClick={handleUpdate}><BsPen className='inline'/> Edit</p>
                    </div>
                </div>

                <div className="h-5/6">
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
                <Modal isOpen={isDeleteModal} onRequestClose={()=>setIsDeleteModal(false) } style={customStyles}>
                    <h1 className="">Are you sure to delete these rows? </h1>
                    <p className="">[{selectedRows.join(', ')}] {selectedRows.length < 1 && <span className='text-red-500 italic'>No selected row</span>}</p>
                    <div className="flex justify-end mt-4 gap-3">
                        <button className="bg-neutral-100  p-3 text-sm" onClick={()=>setIsDeleteModal(false)}>Cancel</button>
                        <button className="bg-red-500 text-white p-3 inline text-sm" onClick={handleDelete}><BsTrash className='inline'/> Delete</button>
                    </div>
                </Modal>
                <Modal isOpen={isEdit} onRequestClose={()=>setIsEdit(false) } style={customStyles}>
                    {<Form user={users.filter((user)=> user.id === selectedRows[0])} title="Edit" />}
                </Modal>
                <Modal isOpen={isAdd} onRequestClose={()=>setIsAdd(false) } style={customStyles} >
                    <Form title="Add"/>
                </Modal>
            </div>
        </div>
  )
}

export default page

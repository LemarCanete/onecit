import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { collection, doc, documentId, getDoc, getDocs, or, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import { BsChat, BsCheck, BsGrid, BsList, BsPen, BsThreeDots, BsTrash, BsX } from 'react-icons/bs'
import Box from '@mui/material/Box';
import { DataGrid  } from '@mui/x-data-grid';
import Modal from 'react-modal'
import UpdateForm from './UpdateForm'
import { useRouter } from 'next/navigation';

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

const Appointments = ({email}) => {
    const [appointments, setAppointments] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([])
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const router = useRouter();
    
    const columns = [
        // { field: 'id', headerName: 'ID', width: 90 },
        {
            field: "fullname",
            headerName: 'Full Name',
            width: 120,
            editable: true,
            // valueGetter: ({value}) => value.data.from.firstname,
            valueGetter: (value) => `${value.row.from.firstname} ${value.row.from.lastname}`,
        },
        {
            field: 'phonenumber',
            headerName: 'Contact Number',
            width: 110,
            editable: true,
            type: "number",
        },
        {
            field: 'program',
            headerName: 'Program',
            width: 110,
            editable: true,
            valueGetter: (value) => value.row.from.program,

        },
        {
            field: 'role',
            headerName: 'Role',
            width: 110,
            editable: true,
            valueGetter: (value) => value.row.from.role,
        },
        {
            field: 'date',
            headerName: 'Appointment',
            type: 'date',
            width: 170,
            editable: true,
            valueFormatter: (params) => {
                if (!params?.value) return ''; // Handle potential missing value gracefully
                const dateObject = new Date(params.value);
                return dateObject.toLocaleString('en-US', { // Use 'en-US' locale example, adjust based on your needs
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                });
              },
        },
        {
            field: 'reason',
            headerName: 'Reason',
            width: 320,
            editable: true,
        },
        {
            field: 'position',
            headerName: 'Position',
            width: 110,
            editable: true,
            valueGetter: (value) => value.row.to.position,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 160,
            editable: true,
            valueGetter: (value) => value.row.to.email,
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            editable: true,
            renderCell: (params) => {
                const { row, id } = params;
                console.log(params)
                if (row.to.email === currentUser.email && row.status === "pending") {
                  return (
                    <div className='flex'>
                        <button className="text-teal-500 pe-2" onClick={() => handleStatus("Accepted", id)} >Accept<BsCheck className='text-center'/></button>
                        <button className='text-red-500' onClick={() => handleStatus("Declined", id)} >Decline<BsX className='text-center'/></button>
                        <BsChat className='ms-3 text-lg cursor-pointer' onClick={() => handleChat(row.to.email)}/>
                    </div>
                  );
                } else {
                  return <div className="flex w-28 justify-items-end justify-between">
                    <span>{row.status}</span>
                    <BsChat className='cursor-pointer text-lg' onClick={() => handleChat(row.to.email)}/>
                  </div>
                }
              },
        },
        
    ];


    useEffect(()=>{
        const fetchData = async () => {
            try {
                let querydata;

                if(currentUser.role === "admin"){
                    querydata = query(collection(db, "appointments"))
                }else{
                    querydata = query(collection(db, "appointments"),
                        or(where("from.email", "==", currentUser.email), where("to.email", "==", currentUser.email)))
                }
                

                const querySnapshot = await getDocs(querydata)
                
                let appointmentData = [];

                querySnapshot.forEach((doc)=>{
                    appointmentData.push({ ...doc.data(), id: doc.id}); 
                    
                })

                setAppointments(appointmentData);
                
            } catch (err) {
                console.error(err);
            }
          };
          fetchData();
    }, [currentUser])

    const handleStatus = async(stat, id) =>{
        const status = doc(db, "appointments", id)
        const res = await updateDoc(status, {status: stat})
        .then(()=> window.location.reload())
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
        selectedRows.forEach(async(id) => {
            await deleteDoc(doc(db, 'appointments', id))
        })

        window.location.reload();
    }

    const handleChat = (e) =>{
        e && router.push(`/Chat/?email=${encodeURIComponent(e)}`)
    }
    console.log(selectedRows);
    return (
        <div className=''>
            <div className="flex justify-between items-center">
                <h1 className='text-lg py-5'>{currentUser.role === "admin" ? "All" : "My"} Appointments</h1>
                <div className="flex gap-3">
                    <p className="rounded inline text-sm p-2 cursor-pointer border"><BsList className='inline text-lg'/> List</p>
                    <p className="rounded inline text-sm p-2 cursor-pointer border"><BsGrid className='inline text-lg'/> Grid</p>
                    <p className="inline cursor-pointer bg-red-500 rounded p-2 text-white" onClick={()=>setIsDeleteModal(true)}><BsTrash className='inline' /> Delete</p>
                    <p className="inline cursor-pointer bg-teal-500 rounded p-2 text-white" onClick={handleUpdate}><BsPen className='inline'/> Edit</p>
                </div>
            </div>
            <div className="w-full">
                {appointments && 
                <Box className={`${currentUser.role === "admin" ? 'h-5/6' : 'h-96'}`} style={{width: "100%"}}>
                    {currentUser.role && <DataGrid
                        rows={appointments}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: {
                            pageSize: currentUser.role === "admin" ? 10 : 5,
                            },
                        },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        // disableRowSelectionOnClick
                        onRowSelectionModelChange={rows => setSelectedRows(rows) }
                    />}
                </Box>}

                <Modal isOpen={isDeleteModal} onRequestClose={()=>setIsDeleteModal(false) } style={customStyles}>
                    <h1 className="">Are you sure to delete these rows? </h1>
                    <p className="">[{selectedRows.join(', ')}] {selectedRows.length < 1 && <span className='text-red-500 italic'>No selected row</span>}</p>
                    <div className="flex justify-end mt-4 gap-3">
                        <button className="bg-neutral-100  p-3 text-sm" onClick={()=>setIsDeleteModal(false)}>Cancel</button>
                        <button className="bg-red-500 text-white p-3 inline text-sm" onClick={handleDelete}><BsTrash className='inline'/> Delete</button>
                    </div>
                </Modal>
                <Modal isOpen={isEdit} onRequestClose={()=>setIsEdit(false) } style={customStyles}>
                    <UpdateForm setIsEdit={setIsEdit} id={selectedRows}/>
                </Modal>
            </div>
        </div>
  )
}





export default Appointments
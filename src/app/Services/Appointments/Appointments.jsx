import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { collection, doc, documentId, getDoc, getDocs, or, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const {currentUser} = useContext(AuthContext);

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: "firstname",
            headerName: 'First name',
            width: 120,
            editable: true,
            // valueGetter: ({value}) => value.data.from.firstname,
            valueGetter: (value) => value.row.from.firstname,
        },
        {
            field: 'lastname',
            headerName: 'Last name',
            width: 120,
            editable: true,
            valueGetter: (value) => value.row.from.lastname,

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
            width: 110,
            editable: true,
            valueFormatter: (params) => new Date(params?.value).toLocaleDateString(),
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
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 110,
            editable: true,
        },
      ];


    useEffect(()=>{
        const fetchData = async () => {
            try {
                const querydata = query(collection(db, "appointments"),
                    or(where("from.email", "==", currentUser.email), where("to", "==", currentUser.email)))

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
    }, [currentUser.email])

    console.log(appointments)

    return (
        <div className=''>
            <h1 className='text-lg py-5'>My Appointments</h1>
            <div className="w-full">
                {appointments && 
                <Box className="h-96" style={{width: "100%"}}>
                    <DataGrid
                        rows={appointments}
                        columns={columns}
                        initialState={{
                        pagination: {
                            paginationModel: {
                            pageSize: 5,
                            },
                        },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                    />
                </Box>}
            </div>
        </div>
  )
}


export default Appointments
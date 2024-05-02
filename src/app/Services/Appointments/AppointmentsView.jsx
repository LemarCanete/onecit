import { AuthContext } from '@/context/AuthContext';
import { db } from '@/firebase-config';
import { collection, doc, documentId, getDoc, getDocs, or, query, where, updateDoc, deleteDoc, onSnapshot, addDoc, Timestamp } from 'firebase/firestore';
import React, { useContext, useDebugValue, useEffect, useState } from 'react'
import { BsChat, BsCheck, BsGrid, BsList, BsPen, BsThreeDots, BsTrash, BsX } from 'react-icons/bs'
import { CiViewList, CiCalendarDate  } from "react-icons/ci";
import Box from '@mui/material/Box';
import { DataGrid  } from '@mui/x-data-grid';
import Modal from 'react-modal'
import UpdateForm from './UpdateForm'
import { useRouter } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '1300px',
      minWidth: '500px'
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5"
    }
};

Modal.setAppElement("body")

const AppointmentsView = ({email}) => {
    const [appointments, setAppointments] = useState([]);
    const {currentUser} = useContext(AuthContext);
    const [selectedRows, setSelectedRows] = useState([])
    const [isDeleteModal, setIsDeleteModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isParticipantsStatus, setIsParticipantsStatus] = useState(false)
    const [selectedParticipants, setSelectedParticipants] = useState([])
    const [responseFilter, setResponseFilter] = useState("All")
    const [viewProfile, setViewProfile] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState({});
    const router = useRouter();
    const columns = [
        // { field: 'id', headerName: 'Appointment ID', width: 200 },
        {
            field: 'createdBy',
            headerName: 'Created By',
            width: 100,
            editable: true,
            renderCell: (params) => {
                const {row} = params;
                const {createdBy} = row;
                return (
                    <div className='flex' >
                        <img src={createdBy?.photoURL || '/schoolLogo.png'} alt="" className='w-6 cursor-pointer' onClick={()=>{setViewProfile(true); setSelectedProfile(createdBy)}}/>
                    </div>
                );
            },
        },
        {
            field: 'phonenumber',
            headerName: 'Contact Number',
            width: 110,
            editable: true,
            type: "number",
        },
        {
            field: 'date',
            headerName: 'Date',
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
            width: 330,
            editable: true,
        },
        {
            field: 'location',
            headerName: 'location',
            width: 120,
            editable: true,
        },
        {
            field: 'to',
            headerName: 'Participants',
            width: 280,
            editable: true,
            renderCell: (params) => {
                const {row} = params;
                const {participants, to} = row;
                return (
                    <div className='flex'>
                        {participants.map((participant, key) => {
                            const participantStatus = to.find((t) => t.uid === participant.uid)?.status || "Pending";
                            if (participantStatus !== "Accepted" ) {
                                return null;
                            } else {
                                return (
                                    <div className="" key={key}>
                                        <img 
                                            src={participant?.photoURL || '/schoolLogo.png'} alt="" className='w-6 cursor-pointer' 
                                            onClick={() => {
                                                setViewProfile(true); 
                                                setSelectedProfile(participant);
                                            }} 
                                        />
                                    </div>
                                );
                            }
                        })}
                    </div>
                );
            },
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            editable: true,
        },
        {
            headerName: 'Response',
            width: 120,
            editable: true,
            renderCell: (params) => {
                const { row, id } = params;
                const {participants, to, createdBy, reason, date} = row;
                const participant = participants.filter(participant => participant.uid === currentUser.uid)[0];

                if(createdBy.uid === currentUser.uid && participants || currentUser.role === "admin"){
                    return <div className="">
                        <button className='text-2xl text-center' onClick={()=>viewAppointmentsParticipantsStatus(participants, to)}><CiViewList /></button>
                    </div>
                }else{
                    const status = to.filter(t => t.uid === participant?.uid)[0]

                    if (status.status === "Pending") {
                    console.log(date, reason)
                    return (
                        <div className='flex gap-2'>
                            <button className='text-teal-500' onClick={() => handleStatus(to, "Accepted", id, participant.uid, reason, participant.role, date)} >Accept<BsCheck className='text-center'/></button>
                            <button className='text-red-500' onClick={() => handleStatus(to, "Declined", id, participant.uid, reason, participant.role, date)} >Decline<BsX className='text-center'/></button>
                            {/* <BsChat className='ms-3 text-lg cursor-pointer' onClick={() => handleChat(row.to.email)}/> */}
                        </div>
                    );
                    } else {
                    return <div className="flex w-28 justify-items-end justify-between">
                        <select name="" id="" value={status.status} className='bg-transparent cursor-pointer border-b py-1 px-2 outline-none' onChange={e => handleStatus(to, e.target.value, id, participant.uid, reason, participant.role, date)}>
                            <option value="Declined">Declined</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Pending">Pending</option>
                        </select>
                        {/* <BsChat className='cursor-pointer text-lg' onClick={() => handleChat(row.to.email)}/> */}
                    </div>
                    }
                }

              },
        },
        
    ];
    console.log(appointments)
    useEffect(() => {
        const fetchData = async () => {
            try {
                let querydata;
    
                if (currentUser.role === "admin") {
                    querydata = collection(db, "appointments");
                } else {
                    querydata = query(collection(db, "appointments"),
                        or(
                            where("from.uid", "==", currentUser.uid),
                            where("to", "array-contains", { status: "Pending", uid: currentUser.uid }),
                            where("to", "array-contains", { status: "Accepted", uid: currentUser.uid }),
                            where("to", "array-contains", { status: "Declined", uid: currentUser.uid })
                        )
                    );
                }
    
                const unsubscribe = onSnapshot(querydata, (querySnapshot) => {
                    const appointmentData = [];
    
                    querySnapshot.forEach(doc => {
                        appointmentData.push({ ...doc.data(), id: doc.id });
                    });
    
                    Promise.all(appointmentData.map(async (appointment) => {
                        const participants = [];
                        const userDoc = await getDoc(doc(db, "users", appointment.from.uid));
                        await Promise.all(appointment.to.map(async (participant) => {
                            const userDoc = await getDoc(doc(db, "users", participant.uid));
                            participants.push(userDoc.data());
                        }));
                        const userData = userDoc.data();
                        return { ...appointment, createdBy: userData, participants };
                    })).then((appointmentsWithUserDetails) => {
                        setAppointments(appointmentsWithUserDetails);
                    });
                });
    
                return () => unsubscribe();
    
            } catch (err) {
                alert(err.message);
            }
        };
    
        currentUser.uid && fetchData()
    
    }, [currentUser]);
    
    console.log(appointments)
    const handleStatus = async(to, stat, id, participantId, reason, role, date) =>{
        for(const participant of to){
            if(participant.uid === participantId){
                participant.status = stat
                break;
            }
        }
        const res = await updateDoc(doc(db, "appointments", id), {to: to})

        console.log(date, reason, participantId)
        if(stat === "Accepted"){
            const addSubEvent = await addDoc(collection(db, "calendarEvents"),
                {value: {startDate: date, endDate: date}, title: reason, user: participantId, role, appointmentId: id}
            )
        }else{
            const eventToDelete = await getDocs(query(collection(db, "calendarEvents"),
                where("appointmentId", "==", id),
                where("user", '==', participantId)
            ));
            
            if (eventToDelete.docs.length > 0) {
                await deleteDoc(eventToDelete.docs[0].ref);
            }
        }
       
    }

    const handleUpdate = () =>{
        if(selectedRows.length > 1 || selectedRows.length < 1) return;

        setIsEdit(true)
    }

    const handleDelete = async () => {
        if (selectedRows.length < 1) {
            setIsDeleteModal(false);
            return;
        }
    
        for (const id of selectedRows) {
            //add notification when deleted
            const deleteNotification = await getDocs(query(collection(db, "notifications"),
                where("appointmentId", "==", id),
            ));
            
            //copy notification and change the date(make it Timestamp.now()) and change senderMessage
            if (deleteNotification.docs.length > 0) {
                for (const doc of deleteNotification.docs) {
                    const notificationData = doc.data();
    
                    // Create a new notification with modified details
                    await addDoc(collection(db, "notifications"), {
                        senderName: notificationData.senderName,
                        senderUid: notificationData.senderUid,
                        receivedByUid: notificationData.receivedByUid,
                        senderMessage: "Appointment has been deleted.",
                        date: Timestamp.now(),
                        link: notificationData.link,
                        isRead: false,
                        appointmentId: id,
                    });
                }
            }

            // Delete from appointments
            await deleteDoc(doc(db, 'appointments', id));
    
            // Delete from calendarEvents
            const eventToDelete = await getDocs(query(collection(db, "calendarEvents"),
                where("appointmentId", "==", id),
            ));
    
            if (eventToDelete.docs.length > 0) {
                for (const docRef of eventToDelete.docs) {
                    await deleteDoc(docRef.ref);
                }
            }
        }

        // add notification
            // participants.map(async(participant) => {
            //     const notification = await addDoc(collection(db, "notifications"), 
            //         {
            //             senderName: `${firstname} ${lastname}`,
            //             senderUid: uid,
            //             receivedByUid: participant.uid,
            //             senderMessage: "has scheduled an appointment with you. Please confirm.",
            //             date: Timestamp.now(),
            //             link: '/Services/Appointments',
            //             isRead: false,
            //             appointmentId: appointment.id
            //         }
            //     )
            // })

        setIsDeleteModal(false);
    };

    const viewAppointmentsParticipantsStatus = (participants, to) => {
        const arr = participants.map((participant, i) => {
            const matchedStatus = to.find(t => participant.uid === t.uid)?.status

            if (matchedStatus) {
                return { ...participant, status: matchedStatus };
            }
            return null;
        }).filter(Boolean);
    
        setSelectedParticipants(arr);
        setIsParticipantsStatus(true);
    }
    return (
        <div className=''>
            <div className="flex justify-between items-center">
                <h1 className='text-lg py-5'>{currentUser.role === "admin" ? "All" : "My"} Appointments</h1>
                <div className="flex gap-3">
                    <CiCalendarDate className='text-4xl cursor-pointer' onClick={() => router.push('/CalendarofEvents')}/>
                    <p className="inline cursor-pointer bg-red-500 rounded p-2 text-white" onClick={()=>setIsDeleteModal(true)}><BsTrash className='inline' /> Delete</p>
                    <p className="inline cursor-pointer bg-teal-500 rounded p-2 text-white" onClick={handleUpdate}><BsPen className='inline'/> Edit</p>
                </div>
            </div>
            <div className="w-full">
                {appointments.length > 0 && currentUser.role && (
                <Box className={`${currentUser.role === "admin" ? 'h-5/6' : 'h-96'} bg-white`} style={{width: "100%"}}>
                    <DataGrid
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
                    />
                </Box>)}
                
                {appointments.some(appointment => selectedRows.includes(appointment.id) && (appointment.from.uid === currentUser.uid || currentUser.role === "admin")) && (
                    <Modal isOpen={isDeleteModal} onRequestClose={()=>setIsDeleteModal(false) } style={customStyles}>
                        <h1 className="">Are you sure to delete these rows? </h1>
                        <p className="">[{selectedRows.join(', ')}] {selectedRows.length < 1 && <span className='text-red-500 italic'>No selected row</span>}</p>
                        <div className="flex justify-end mt-4 gap-3">
                            <button className="bg-neutral-100  p-3 text-sm" onClick={()=>setIsDeleteModal(false)}>Cancel</button>
                            <button className="bg-red-500 text-white p-3 inline text-sm" onClick={handleDelete}><BsTrash className='inline'/> Delete</button>
                        </div>
                    </Modal>
                )}

                <Modal isOpen={isEdit} onRequestClose={()=>setIsEdit(false) } style={customStyles}>
                    <UpdateForm setIsEdit={setIsEdit} currentUser={currentUser}
                        appointment={appointments.filter(appointment => appointment.id === selectedRows[0])[0]}/>
                </Modal>
                <Modal isOpen={viewProfile} onRequestClose={()=>setViewProfile(false) } style={customStyles}>
                    <ProfileCard userData={selectedProfile}/>
                </Modal>
                <Modal isOpen={isParticipantsStatus} onRequestClose={()=>{setIsParticipantsStatus(false); setResponseFilter("All")} } style={customStyles}>
                    <div className="text-sm w-96 h-96">
                        <div className="flex justify-between mb-5">
                            <h1 className='font-bold'>Appointment Responses Status</h1>
                            <select name="statusFilter" id="" className='border-b' onChange={e => setResponseFilter(e.target.value)} value={responseFilter}>
                                <option value="All">All</option>
                                <option value="Accepted">Accepted</option>
                                <option value="Declined">Declined</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>
                        {selectedParticipants.map((participant, key)=>{
                            if(responseFilter === "All"){
                                return <li className='list-decimal list-outside' key={key}>{participant.firstname} {participant.lastname}- {participant.status}</li>
                            }else {
                                return participant.status === responseFilter && <li className='list-decimal list-outside' key={key}>{participant.firstname} {participant.lastname}- {participant.status}</li>
                            }
                        })}
                    </div>
                </Modal>
            </div>
        </div>
  )
}





export default AppointmentsView



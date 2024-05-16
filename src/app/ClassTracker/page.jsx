'use client'

import React, { useState, useEffect, useContext } from 'react';
import Navbar from '@/components/NavbarIconsOnly';
import AddClassForm from './AddClassForm';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useRouter } from 'next/navigation';
import { db } from '@/firebase-config'; 
import { collection, getDocs, addDoc, deleteDoc, doc, where, query } from 'firebase/firestore';
import { AuthContext } from '@/context/AuthContext';

const ClassTracker = () => {
    const [classes, setClasses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                if(currentUser && currentUser.uid) {
                    const q = query(collection(db, 'classes'), where("id", "==", currentUser.uid));
                    const querySnapshot = await getDocs(q);  
                    const fetchedClasses = querySnapshot.docs.map(doc => ({
                        uid: doc.id,
                        ...doc.data()
                    }));
                    setClasses(fetchedClasses);
                }
            } catch (error) {
                console.error('Error fetching classes: ', error);
            }
        };
        
        fetchClasses();
    }, [currentUser]);

    const handleAddClass = async (classData) => {
        try {
            if(currentUser && currentUser.uid) {
                const docRef = await addDoc(collection(db, 'classes'), { ...classData, userId: currentUser.uid });
                const newClass = { id: docRef.id, ...classData }; 
                setClasses(prevClasses => [...prevClasses, newClass]); 
                setShowAddForm(false);
            }
        } catch (error) {
            console.error('Error adding class: ', error);
        }
    };

    const handleDeleteClass = async (classId) => {
        try {
            if(currentUser && currentUser.uid) {
                console.log(classId);
                await deleteDoc(doc(db, 'classes', classId));
                setClasses(prevClasses => prevClasses.filter(classItem => classItem.uid !== classId));
            }
        } catch (error) {
            console.error('Error deleting class: ', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredClasses = classes.filter(classItem =>
        classItem.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.schedule.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Group classes by day
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const groupedClasses = daysOfWeek.map(day => ({
        day,
        classes: filteredClasses.filter(classItem => classItem.schedule.toLowerCase().includes(day.toLowerCase()))
    }));

    return (
        <div className="w-full h-screen flex bg-neutral-50 overflow-hidden">
            <Navbar active="Classes" />
            <div className="grow px-10 py-5 overflow-y-scroll">
                <div className="flex gap-5 align-center justify-between">
                    <button onClick={()=>router.back()}>
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                    </button>
                    {currentUser.role === 'student' && <button className="flex items-center gap-2 text-sm hover:underline" onClick={()=>setIsOpenAdmin(!isOpenAdmin)}>
                    </button>}
                </div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Class Tracker</h1>
                    <div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border-2 border-gray-200 rounded-lg p-2"
                        />
                        <button onClick={() => setShowAddForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">+ Add Class</button>
                    </div>
                </div>
                {showAddForm && <AddClassForm onSubmit={handleAddClass} onCancel={() => setShowAddForm(false)} />}
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {groupedClasses.map(({ day, classes }) => (
                        <div key={day}>
                            <h2 className="text-lg font-semibold mb-2">{day}</h2>
                            {classes.map(classItem => (
                                <div key={classItem.uid} className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                                    <div className='w-1/3'>
                                        <h3 className="text-lg font-semibold">{classItem.className}</h3>
                                        <p className="text-sm text-gray-500">{classItem.location}</p>
                                    </div>
                                    <div className='w-1/3'>
                                        <p className="text-sm text-gray-500">{classItem.instructor}</p>
                                        <p className="text-sm text-gray-500">{classItem.schedule}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteClass(classItem.uid)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassTracker;

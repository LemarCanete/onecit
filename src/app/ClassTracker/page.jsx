'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AddClassForm from './AddClassForm'; 
import { db } from '@/firebase-config'; 
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const ClassTrackerPage = () => {
    const [classes, setClasses] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'classes'));
                const fetchedClasses = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setClasses(fetchedClasses);
            } catch (error) {
                console.error('Error fetching classes: ', error);
            }
        };
        fetchClasses();
    }, []);
    const handleAddClass = async (classData) => {
        try {
            const docRef = await addDoc(collection(db, 'classes'), classData);
            setClasses(prevClasses => [...prevClasses, { id: docRef.id, ...classData }]);
        } catch (error) {
            console.error('Error adding class: ', error);
        }
    };
    const handleDeleteClass = async (classId) => {
        try {
            await deleteDoc(doc(db, 'classes', classId));
            setClasses(prevClasses => prevClasses.filter(classItem => classItem.id !== classId));
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
    return (
        <div className="w-full h-screen flex bg-neutral-50 overflow-hidden">
            <Navbar active="Classes" />
            <div className="grow px-10 py-5 overflow-y-scroll">
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
                    {filteredClasses.map((classItem) => (
                        <div key={classItem.id} className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-semibold">{classItem.className}</h2>
                                <p className="text-sm text-gray-500">{classItem.location}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">{classItem.instructor}</p>
                                <p className="text-sm text-gray-500">{classItem.schedule}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteClass(classItem.id)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClassTrackerPage;

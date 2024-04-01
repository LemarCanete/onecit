'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AddAnnouncementForm from './AddAnnouncementForm';
import { db } from '@/firebase-config';
import { doc, collection, getDocs, deleteDoc, setDoc } from 'firebase/firestore';

const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const categories = ["General", "Updates", "Maintenance", "Other"];

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'announcements'));
                const fetchedAnnouncements = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAnnouncements(fetchedAnnouncements);
            } catch (error) {
                console.error('Error fetching announcements: ', error);
            }
        };
        fetchAnnouncements();
    }, []);

    const handleAddAnnouncement = async (announcement) => {
        const newAnnouncement = {
            ...announcement,
            id: undefined
        };
        try {
            const docRef = await addDoc(collection(db, 'announcements'), newAnnouncement);
            console.log('Document successfully written!');
            setAnnouncements(prevAnnouncements => [...prevAnnouncements, { id: docRef.id, ...newAnnouncement }]);
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    };

    const handleDeleteAnnouncement = async (announcementId) => {
        try {
            await deleteDoc(doc(db, 'announcements', announcementId));
            console.log('Document successfully deleted!');
            setAnnouncements(prevAnnouncements => prevAnnouncements.filter(announcement => announcement.id !== announcementId));
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-screen flex bg-neutral-50 overflow-hidden">
            <Navbar active="Announcements" />
            <div className="grow px-10 py-5 overflow-y-scroll">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Announcements</h1>
                    <div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border-2 border-gray-200 rounded-lg p-2"
                        />
                        <button onClick={() => setShowAddForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">+ Add Announcement</button>
                    </div>
                </div>
                {showAddForm && <AddAnnouncementForm onSubmit={handleAddAnnouncement} onCancel={() => setShowAddForm(false)} categories={categories} />}
                <div className="space-y-4 mt-4 block">
                    {filteredAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                            <div className=''>
                                <h2 className="text-lg font-semibold">{announcement.title}</h2>
                                <p className="text-sm text-gray-500">{announcement.date}</p>
                                <p className="mt-2 text-gray-700">{announcement.content}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
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

export default AnnouncementsPage;
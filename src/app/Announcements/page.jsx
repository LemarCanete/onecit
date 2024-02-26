'use client'
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AddAnnouncementForm from './AddAnnouncementForm';

const AnnouncementsPage = () => {
    const initialAnnouncements = [
        { id: 1, title: "Important Update", date: "2024-02-26", content: "AKOY NATUTULOG", category: "General" },
        { id: 2, title: "New Feature Announcement", date: "2024-02-26", content: "HATDOG", category: "Updates" },
        { id: 3, title: "Upcoming Maintenance", date: "2024-02-26", content: "LIBOG KO DAH", category: "Maintenance" },
    ];
    
    const [announcements, setAnnouncements] = useState(initialAnnouncements);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const categories = ["General", "Updates", "Maintenance", "Other"];

    const handleAddAnnouncement = (announcement) => {
        setAnnouncements([...announcements, { ...announcement, id: Math.random() }]);
        setShowAddForm(false);
    };

    const handleDeleteAnnouncement = (id) => {
        setAnnouncements(announcements.filter(announcement => announcement.id !== id));
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredAnnouncements = searchTerm.length === 0 ? announcements : announcements.filter(announcement => 
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-screen flex bg-neutral-50">
            <Navbar active="Announcements" />
            <div className="grow px-10 py-5">
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
                <div className="space-y-4 mt-4">
                    {filteredAnnouncements.map((announcement) => (
                        <div key={announcement.id} className="bg-white shadow rounded-lg p-6 flex justify-between items-center">
                            <div>
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
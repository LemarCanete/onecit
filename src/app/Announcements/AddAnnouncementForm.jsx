'use client'
import React, { useState } from 'react';
import { db } from '../../firebase-config';
import { addDoc, collection } from 'firebase/firestore';

const AddAnnouncementForm = ({ onSubmit, onCancel, categories }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const docRef = await addDoc(collection(db, 'announcements'), {
                title,
                date,
                content,
                category
            });
            onSubmit({ id: docRef.id, title, date, content, category });

            setTitle('');
            setDate('');
            setContent('');
            setCategory('');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Announcement</h2>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input 
                    type="text" 
                    id="title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter title" 
                    required 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input 
                    type="date" 
                    id="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Enter content" 
                    required 
                    rows="4" 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select 
                    id="category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    required 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="">Select Category</option>
                    {categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="flex justify-end">
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
                >
                    Submit
                </button>
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddAnnouncementForm;

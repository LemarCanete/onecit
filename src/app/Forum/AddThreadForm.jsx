'use client'
import React, { useState } from 'react';
import { db } from '@/firebase-config';
import { collection, addDoc } from 'firebase/firestore';

const AddThreadForm = ({ onAddThread, onCancel }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [date, setDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        setIsSubmitting(true);

        const newThread = {
            title,
            content,
            date
        };

        try {
            const docRef = await addDoc(collection(db, 'threads'), newThread);
            console.log('Thread added with ID: ', docRef.id);
            onAddThread({ id: docRef.id, ...newThread });
            setTitle('');
            setContent('');
            setDate('');
            onCancel();
        } catch (error) {
            console.error('Error adding thread: ', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Add Thread</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="border-2 border-gray-200 rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-2">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="border-2 border-gray-200 rounded-lg p-2 w-full"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        className="border-2 border-gray-200 rounded-lg p-2 w-full h-32"
                    />
                </div>
                <div className="flex justify-end">
                    <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">Cancel</button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddThreadForm;

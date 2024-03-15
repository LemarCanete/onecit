'use client'
import React, { useState } from 'react';
import { db } from '../../firebase-config';
import { addDoc, collection } from 'firebase/firestore';

const AddForumPostForm = ({ onCancel, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Add the document to the "forumPosts" collection in Firestore
            const docRef = await addDoc(collection(db, 'forumPosts'), {
                title,
                content,
                // You can add more fields here if needed
            });

            console.log('Document written with ID: ', docRef.id);

            // Execute the onSubmit callback if provided
            if (onSubmit) {
                onSubmit({ id: docRef.id, title, content });
            }
        } catch (error) {
            console.error('Error adding document: ', error);
        }

        // Clear the form fields
        setTitle('');
        setContent('');
        onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-4">
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                    id="content"
                    rows="4"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none"
                ></textarea>
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={onCancel} className="text-sm text-gray-600 hover:text-gray-800 mr-2 focus:outline-none">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md focus:outline-none">Post</button>
            </div>
        </form>
    );
};

export default AddForumPostForm;
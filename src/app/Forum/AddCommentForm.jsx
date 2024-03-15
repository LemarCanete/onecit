'use client'
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase-config';

const AddCommentForm = ({ postId, onCommentAdded }) => {
    const [content, setContent] = useState('');
    const [showForm, setShowForm] = useState(false); // State to control the display of the form

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const commentData = {
                postId,
                content,
                createdAt: serverTimestamp(), // Ensuring the comment has a timestamp
            };
            await addDoc(collection(db, 'comments'), commentData);
            setContent('');
            if (onCommentAdded) {
                onCommentAdded();
            }
            setShowForm(false); // Hide the form again after submitting
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    return (
        <>
            {!showForm && (
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
                >
                    Add Comment
                </button>
            )}
            {showForm && (
                <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                        rows="3"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Add your comment..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
                        autoFocus // Automatically focus the textarea when the form is shown
                    ></textarea>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">
                        Post Comment
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md mt-2 ml-2"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </>
    );
};

export default AddCommentForm;
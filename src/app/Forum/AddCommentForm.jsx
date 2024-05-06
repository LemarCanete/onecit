'use client'
import React, { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase-config';

const AddCommentForm = ({ threadId }) => {
    const [comment, setComment] = useState('');
    const {currentUser} = useContext (AuthContext);


    const handleSubmit = async (event) => {
        event.preventDefault();
        const uid = currentUser.uid
        try {
            const commentData = {
                content: comment,
                threadId: threadId,
                uid: uid,
                createdAt: serverTimestamp()
            };
            await addDoc(collection(db, 'comments'), commentData);
            console.log('Comment successfully added!');
            setComment('');
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add your comment..."
                className="w-full border-2 border-gray-200 rounded-lg p-2"
                rows={4}
                required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Add Comment</button>
        </form>
    );
};

export default AddCommentForm;
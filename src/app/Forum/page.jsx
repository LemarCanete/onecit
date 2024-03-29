'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AddThreadForm from './AddThreadForm';
import AddCommentForm from './AddCommentForm';
import { db } from '@/firebase-config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const ForumPage = () => {
    const [threads, setThreads] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCommentForm, setShowCommentForm] = useState({});
    const [comments, setComments] = useState({}); 
    const [commentInput, setCommentInput] = useState(''); 

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                setLoading(true);
                const querySnapshot = await getDocs(collection(db, 'threads'));
                const fetchedThreads = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    showCommentForm: false,
                    comments: [] 
                }));
                setThreads(fetchedThreads);
                
                fetchedThreads.forEach(async thread => {
                    const commentSnapshot = await getDocs(collection(db, `threads/${thread.id}/comments`));
                    const fetchedComments = commentSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    setComments(prevComments => ({
                        ...prevComments,
                        [thread.id]: fetchedComments
                    }));
                });

                setLoading(false);
            } catch (error) {
                setError('Error fetching threads');
                setLoading(false);
            }
        };
        fetchThreads();
    }, []);

    const handleAddThread = async (thread) => {
        try {
            const docRef = await addDoc(collection(db, 'threads'), thread);
            console.log('Thread successfully created!');
            const threadWithComments = { ...thread, id: docRef.id, showCommentForm: false, comments: [] };
            setThreads(prevThreads => [...prevThreads, threadWithComments]);
            setShowAddForm(false);
        } catch (error) {
            console.error('Error creating thread: ', error);
        }
    };

    const handleDeleteThread = async (threadId) => {
        try {
            await deleteDoc(doc(db, 'threads', threadId));
            console.log('Thread successfully deleted!');
            setThreads(prevThreads => prevThreads.filter(thread => thread.id !== threadId));
        } catch (error) {
            console.error('Error removing thread: ', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleToggleCommentForm = async (threadId) => {
        setShowCommentForm(prevState => ({ ...prevState, [threadId]: !prevState[threadId] }));
    };

    const handleAddComment = async (commentContent, threadId) => {
        try {
            const commentData = {
                content: commentContent,
                createdAt: new Date()
            };
            const docRef = await addDoc(collection(db, `threads/${threadId}/comments`), commentData);
            console.log('Comment successfully added with ID: ', docRef.id);

            const newComment = { id: docRef.id, ...commentData };
            setComments(prevComments => ({
                ...prevComments,
                [threadId]: [...(prevComments[threadId] || []), newComment]
            }));

            setCommentInput('');

            setShowCommentForm(prevState => ({ ...prevState, [threadId]: false }));
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    const handleDeleteComment = async (commentId, threadId) => {
        try {
            await deleteDoc(doc(db, `threads/${threadId}/comments`, commentId));

            setComments(prevComments => ({
                ...prevComments,
                [threadId]: prevComments[threadId].filter(comment => comment.id !== commentId)
            }));

            console.log('Comment successfully deleted!');
        } catch (error) {
            console.error('Error removing comment: ', error);
        }
    };

    const filteredThreads = threads.filter(thread =>
        thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full h-screen flex bg-neutral-50">
            <Navbar active="Forum" />
            <div className="grow px-10 py-5">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Forum</h1>
                    <div>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border-2 border-gray-200 rounded-lg p-2"
                        />
                        <button onClick={() => setShowAddForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">+ Add Thread</button>
                    </div>
                </div>
                {showAddForm && <AddThreadForm onSubmit={handleAddThread} onCancel={() => setShowAddForm(false)} />}
                {loading && <p>Loading...</p>}
                {error && <p>{error}</p>}
                <div className="space-y-4 mt-4">
                    {filteredThreads.map((thread) => (
                        <div key={thread.id} className="bg-white shadow rounded-lg p-6">
                            <div>
                                <h2 className="text-lg font-semibold">{thread.title}</h2>
                                <p className="text-sm text-gray-500">{thread.date}</p>
                                <p className="mt-2 text-gray-700">{thread.content}</p>
                            </div>
                            <div className="mt-4">
                                <button onClick={() => handleDeleteThread(thread.id)} className="bg-red-500 text-white px-4 py-2 rounded-md mr-2">Delete Thread</button>
                                <button onClick={() => handleToggleCommentForm(thread.id)} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">{showCommentForm[thread.id] ? 'Cancel' : 'Add Comment'}</button>
                                {showCommentForm[thread.id] && (
                                    <div className="mt-2"> {/* Adjusted layout here */}
                                        <textarea 
                                            className="border-2 border-gray-200 rounded-lg p-2 w-full h-24" 
                                            placeholder="Write your comment..." 
                                            value={commentInput} 
                                            onChange={(e) => setCommentInput(e.target.value)}
                                        />
                                        <button onClick={() => handleAddComment(commentInput, thread.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2">Submit</button>
                                    </div>
                                )}
                                <div className="mt-4">
                                    {comments[thread.id] && comments[thread.id].map(comment => (
                                        <div key={comment.id} className="border border-gray-200 rounded-lg p-3 mt-2">
                                            <p>{comment.content}</p>
                                            <button onClick={() => handleDeleteComment(comment.id, thread.id)} className="bg-red-500 text-white px-2 py-1 rounded-md mt-2">Delete Comment</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ForumPage;
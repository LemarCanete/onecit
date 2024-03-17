'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AddForumPostForm from './AddForumPostForm';
import AddCommentForm from './AddCommentForm';
import { db } from '@/firebase-config';
import {collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp,} from 'firebase/firestore';

const ForumPage = () => {
    const [posts, setPosts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPostsAndComments();
    }, []);

    const fetchPostsAndComments = async () => {
        try {
            const postsSnapshot = await getDocs(collection(db, 'forumPosts'));
            const postsData = [];
            for (const postDoc of postsSnapshot.docs) {
                const post = { id: postDoc.id, ...postDoc.data() };
                const commentsQuery = query(collection(db, 'comments'), where('postId', '==', post.id));
                const commentsSnapshot = await getDocs(commentsQuery);
                const comments = commentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                post.comments = comments; // Add comments to the post object
                postsData.push(post);
            }
            setPosts(postsData);
        } catch (error) {
            console.error('Error fetching posts and comments: ', error);
        }
    };

    const handleAddPost = async (post) => {
        try {
            const newPost = { ...post, createdAt: serverTimestamp() };
            const docRef = await addDoc(collection(db, 'forumPosts'), newPost);
            console.log('Document successfully written with ID: ', docRef.id);
            fetchPostsAndComments(); // Refresh the posts and comments after adding a new one
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await deleteDoc(doc(db, 'forumPosts', postId));
            console.log('Document successfully deleted!');
            fetchPostsAndComments(); // Refresh the posts and comments after deleting
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
          await deleteDoc(doc(db, 'comments', commentId));
          console.log('Comment successfully deleted!');
          fetchPostsAndComments(); // Refresh the posts and comments to reflect the deletion
        } catch (error) {
          console.error('Error removing comment: ', error);
        }
      };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
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
                <button onClick={() => setShowAddForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2">
                  + Add Post
                </button>
              </div>
            </div>
    
            {showAddForm && (
              <AddForumPostForm onSubmit={handleAddPost} onCancel={() => setShowAddForm(false)} />
            )}
            <div className="space-y-4 mt-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white shadow rounded-lg p-6">
                  <div>
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                    <p className="mt-2 text-gray-700">{post.content}</p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-100 rounded-md p-2 flex justify-between items-center">
                        <p className="text-gray-700">{comment.content}</p>
                        <button
                          onClick={() => handleDeleteComment(post.id, comment.id)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ml-4"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    <AddCommentForm postId={post.id} onCommentAdded={fetchPostsAndComments} />
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-150 ease-in-out"
                  >
                    Delete Post
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };
    
    export default ForumPage;
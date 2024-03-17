'use client'
import React from 'react';
import Navbar from '@/components/Navbar';

const Page = () => {
  return (
    <div className="w-full h-screen flex bg-neutral-100">
      <Navbar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-semibold mb-8">Ask Advice</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search questions or topics..."
            className="w-full p-4 border border-gray-300 rounded-md"
          />
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Ask a Question</h2>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Type your question here..."
          ></textarea>
          <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
            Submit
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recent Questions</h2>
          {/* Placeholder for questions list */}
          <ul className="space-y-4">
            <li className="p-4 border border-gray-300 rounded-md">How do I start a project in React?</li>
            {/* More questions */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;

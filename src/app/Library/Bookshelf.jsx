import React from 'react';
import { BsX } from 'react-icons/bs';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '@/firebase-config';

const Bookshelf = ({ books }) => {
    // Group books by site
    const groupedBooks = {};
    books.forEach(book => {
        if (!groupedBooks[book.site]) {
            groupedBooks[book.site] = [];
        }
        groupedBooks[book.site].push(book);
    });

    const deleteBook = async(uid) =>{
        await deleteDoc(doc(db, "books", uid));
    }

    return (
        <div>
            <h1 className="font-extrabold tracking-wider text-lg">Saved Books</h1>
            {Object.entries(groupedBooks).map(([site, books]) => (
                <div key={site}>
                    <h1 className="font-bold tracking-wide text-center">{site}</h1>
                    <div className="grid grid-cols-8">
                        {books.sort((a, b) => b.createdTime - a.createdTime).map(book => (
                            <div key={book.uid} className="w-40 flex flex-col items-center gap-2 relative hover:bg-neutral-100 rounded-lg p-2 cursor-pointer"
                                onMouseEnter={e => e.currentTarget.querySelector('.close-icon').style.opacity = 1}
                                onMouseLeave={e => e.currentTarget.querySelector('.close-icon').style.opacity = 0}
                            >
                                <button className='absolute right-0 text-3xl me-1 top-0 opacity-0 close-icon' onClick={()=>deleteBook(book.uid)}><BsX /></button>
                                <img src={book.img || 'schoolLogo.png'} alt="" className='h-28'/>
                                <h1 className="text-sm text-center hover:underline">
                                    <a href={book.link} className="" target='_blank'>{book.title}</a>
                                </h1>
                            </div>
                        ))}
                    </div>
                    <hr className='border-t-4 border-teal-500 my-2'/>
                </div>
            ))}
        </div>
    );
};

export default Bookshelf;

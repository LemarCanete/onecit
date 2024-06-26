import React, { useContext, useState } from 'react'
import {FaExternalLinkAlt} from 'react-icons/fa'
import LibraryInfo from './LibraryInfo';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { useRouter } from 'next/navigation';
import { BsBookmark, BsBookmarkFill, BsSave2 } from 'react-icons/bs';
import { Timestamp, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { AuthContext } from '@/context/AuthContext';
import { doc, deleteDoc } from "firebase/firestore";

const Results = ({details, books}) => {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState("")
    const router = useRouter()
    const {currentUser} = useContext(AuthContext)

    const handleSubmit = async (e) => {
        let goto = details.goto;
        let searchElement = details.searchElement;
        let titleElement = details.titleElement
        let authorElement = details.authorElement
        let imageElement = details.imageElement
        let dateElement = details.dateElement
        let descriptionElement = details.descriptionElement
        let linkElement = details.linkElement

        if (e.keyCode === 13) {
            try{
                if(search === ""){ 
                    setLoading("No results found")
                    return;
                }
                setLoading("Loading...")
                setSearchResults([{}, {}, {}, {}, {}, {}])
                const res = await fetch("/Library/scrapping/searchprod/", {
                    method: "POST",
                    body: JSON.stringify({ search, goto, searchElement, titleElement, authorElement, imageElement, dateElement, descriptionElement, linkElement }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const {results} = await res.json();
                console.log(results)
                setSearchResults(results);
                if(results.length < 1) {
                    setLoading("No results found");
                    return;
                }
                setLoading("");
            }catch(err){
                setLoading(`Something went wrong! Error: ${err.message}`)
            }
        }
    };

    const saveBook = async(title, origin, link, img, author) =>{
        try{
            const docRef = await addDoc(collection(db, "books"), {
                site: details.title,
                title: title,
                link: origin + link,
                img: img ? origin + img : null,
                author: author,
                id: currentUser.uid,
                createdTime: Timestamp.now()
            });
            console.log("Successfully added!")
        }catch(err){
            console.log(err.message)
        }
    }
    
    const deleteBook = async(uid) =>{
        await deleteDoc(doc(db, "books", uid));
    }

    return (
        <div className='px-10 py-5 grow h-full overflow-y-auto h-screen w-11/12'>
           <div className="flex justify-between items-center mb-3">
                <button onClick={()=>router.back()}>
                    <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                </button>
                <div className="flex items-center gap-2 justify-center">
                    <LibraryInfo />
                    <h1 className="text-2xl tracking-widest	font-bold">Library </h1>
                </div>

                {details.username !== "" && (
                    <>
                        <p className="text-sm text-black/50"><span className='font-bold'>Username:</span> {details.username}</p>
                        <p className="text-sm text-black/50"><span className='font-bold'>Password:</span> {details.password}</p>
                    </>
                    )
                }
                <div className="cursor-pointer text-sm flex align-center gap-3">
                    <p className="">{details.title} </p>
                    <a href={details.origin} className="" target='_blank'><FaExternalLinkAlt className=' '/></a>
                </div>
                
           </div>
            <input type="search" 
                className='w-full border rounded p-2 text-sm outline-none' 
                placeholder='Search title here'
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSubmit}
                value={search}
                disabled={details.title === "No site selected" ? true : false}
            />
            <span className="">{loading}</span>

            {searchResults.length > 0 && <div className="text-sm flex justify-between align-center text-black/50 italic py-2">
                <span className="cursor-pointer">Results</span>
                <span className="cursor-pointer" onClick={()=>setSearchResults([])}>X Clear</span>
            </div>}
            {/* search results */}
            {searchResults && searchResults.map((res, i)=>{
                const isBookExist = books.find((book)=> book.link === details.origin + res.link )

                return <div className={`bg-white my-2 p-3 text-sm cursor-pointer shadow-lg flex gap-5 rounded relative ${res.title ? 'hover:scale-105' : 'hover:scale-100 shadow-sm animate-pulse'}`} key={i}>
                    <img src={`${details.origin}${res.image}`} alt="" className='h-28'/>
                    {res.title && <button 
                        className={`absolute right-0 me-2 text-2xl ${isBookExist ? 'text-teal-500' : 'text-neutral-400 hover:text-teal-500'} p-2 rounded`} 
                        onClick={()=>{
                            if(isBookExist){
                                deleteBook(isBookExist.uid)
                            }else{
                                saveBook(res.title, details.origin, res.link, res.image, res.author)
                            }
                        }}><BsBookmarkFill /></button>}
                    <div className="">
                        <a href={`${details.origin}${res.link}`} className="" target='__blank'><p className='font-bold hover:underline'>{res.title}</p></a>
                        <p className="">{res.author}</p>
                        <p className="">{res.date}</p>
                        <p className="">{res.description}</p>
                    </div>
                </div>
            })}
            
            
        </div>
    )
}

export default Results
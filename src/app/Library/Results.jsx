import React, { useEffect, useState } from 'react'

const Results = ({details}) => {
    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState("")

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

    return (
        <div className='px-10 py-5 grow h-full overflow-y-auto h-screen w-11/12'>
           <div className="flex justify-between align-center">
                <h1 className="text-2xl">Library </h1>
                <span className="text-sm">{details.title}</span>
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

            {searchResults && searchResults.map((res, i)=>(
                <div className='bg-white my-2 p-3 text-sm cursor-pointer hover:scale-105 shadow-lg flex gap-5' key={i}>
                    <img src={`${details.origin}${res.image}`} alt="" className='h-28'/>
                    <div className="">
                        <a href={`${details.origin}${res.link}`} className="" target='__blank'><p className='font-bold hover:underline'>{res.title}</p></a>
                        <p className="">{res.author}</p>
                        <p className="">{res.date}</p>
                        <p className="">{res.description}</p>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default Results
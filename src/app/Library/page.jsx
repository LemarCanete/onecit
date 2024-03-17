'use client'
import React, { useState } from 'react'
import Results from './Results'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import { BsSearch } from 'react-icons/bs'

const sites = [
    {
        title: "",
        description: "",
        origin: "",
        goto: "",
        searchElement: "",
        titleElement: "",
        authorElement: "",
        imageElement: "",
        dateElement: "",
        descriptionElement: "",
        linkElement: ""
    },
    {
        title: "Directory of Open Access Books (DOAB)",
        description: "E-books",
        origin: "https://directory.doabooks.org",
        goto: "https://directory.doabooks.org/discover?locale-attribute=en",
        searchElement: ".ds-text-field",
        titleElement: ".artifact-description span a h4",
        authorElement: ".artifact-info .author",
        imageElement: ".img-thumbnail",
        dateElement: ".artifact-info .publisher-date",
        descriptionElement: ".artifact-info .abstract",
        linkElement: ".artifact-description span a"
    },
    {
        title: "Philippine Ebook Hub",
        description: "E-book",
        origin: "https://ebookhub.ph/",
        goto: "https://ebookhub.ph/collection.php?q",
        searchElement: ".search_box form input[type='text']",
        titleElement: ".grid_1_of_4.images_1_of_4 a:nth-child(2) h2",
        authorElement: ".grid_1_of_4.images_1_of_4 .price-details:nth-child(3) p",
        imageElement: ".grid_1_of_4.images_1_of_4 a img",
        dateElement: "",
        descriptionElement: ".grid_1_of_4.images_1_of_4 .price-details:nth-child(4) p",
        linkElement: ".grid_1_of_4.images_1_of_4 a"
    },
    {
        title: "Scientific Academic Research",
        description: " Academic Research E-books and E-journals (Open Access)",
        origin: "https://www.scirp.org/journal/",
        goto: "https://www.scirp.org/journal/articles?searchcode=",
        searchElement: "#ContentPlaceHolder1_txtSearch",
        titleElement: ".list_t span",
        authorElement: ".txt5",
        imageElement: "",
        dateElement: ".list_unit",
        descriptionElement: ".list_doi",
        linkElement: ".list_t span a"
    },
    {
        title: "PubMed",
        description: "E-Journal (Open Access)",
        origin: "https://www.ncbi.nlm.nih.gov",
        goto: "https://www.ncbi.nlm.nih.gov/pmc/?term=",
        searchElement: "#term",
        titleElement: ".title",
        authorElement: ".supp",
        imageElement: "",
        dateElement: ".resc",
        descriptionElement: "",
        linkElement: ".title a"
    },
]

const page = () => {
    const [details, setDetails] = useState(
        {
            title: "No site selected", origin: "", 
            description: "", goto: "",
            searchElement: "", titleElement: "", 
            authorElement: "", imageElement: "",
            dateElement: "", descriptionElement: "",
            linkElement: ""
        }
    )
    const [searchQuery, setSearchQuery] = useState("");

    // Filtered sites based on the search query
    const filteredSites = sites.filter(site =>
        site.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return (
        <div className='w-full h-screen flex bg-neutral-100'>
            <NavbarIconsOnly/>
            <Results details={details}/>
            <div className="w-3/12 h-full bg-white py-5 px-2 flex flex-col">
                <div className="relative">
                    <h3 className=''>Websites</h3>
                    <input type="search" name="" id="" className="border-b focus:outline-none w-full text-sm p-2" placeholder='Search' value={searchQuery}  // Controlled input
                        onChange={e => setSearchQuery(e.target.value)} />
                    {/* <span className="absolute right-0 mt-2 me-2"><BsSearch /></span> */}
                </div>

                <div className="mt-3 overflow-y-auto h-auto">
                    {filteredSites.map((site, id)=>{
                        return <div className="" onClick={()=>setDetails(site)} key={id}>
                            <Lib title={site.title} description={site.description} />
                        </div>
                    })}
                </div>

            </div>
        </div>
    )
}

const Lib = ({title, description}) =>{

    return (
        <div className="flex gap-3 hover:bg-neutral-100 cursor-pointer p-1">
            <img src="/schoolLogo.png" alt="" className="h-12 w-12 " />
            <div className="">
                <h4 className="text-sm font-black">{title}</h4>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    )
}

export default page

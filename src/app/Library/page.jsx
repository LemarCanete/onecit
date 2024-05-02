'use client'
import React, { useState } from 'react'
import Results from './Results'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'

const sites = [
    // {
    //     title: "",
    //     description: "",
    //     username: "",
    //     password: "",
    //     origin: "",
    //     goto: "",
    //     searchElement: "",
    //     titleElement: "",
    //     authorElement: "",
    //     imageElement: "",
    //     dateElement: "",
    //     descriptionElement: "",
    //     linkElement: ""
    // },
    {
        title: "Directory of Open Access Books (DOAB)",
        description: "E-books",
        username: "",
        password: "",
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
        username: "",
        password: "",
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
        username: "",
        password: "",
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
        username: "",
        password: "",
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
    {
        title: "Cambridge Core",
        description: "E-book",
        username: "llrc.lisa@gmail.com",
        password: "libService2019",
        origin: "https://www.cambridge.org",
        goto: "https://www.cambridge.org/core/search?q=",
        searchElement: ".small-10 input[name='q']",
        titleElement: ".title h3",
        authorElement: "li.paragraph_05 ",
        imageElement: "",
        dateElement: ".author",
        descriptionElement: "li dl.do-not-mathjax",
        linkElement: ".title h3 a"
    },
    {
        title: "Emerald emerging market case studies",
        description: "Journals, Books and Case Studies",
        username: "OAN: 307501991999617",
        password: "",
        origin: "https://www.emerald.com",
        goto: "https://www.emerald.com/insight/search?q=",
        searchElement: "#terms",
        titleElement: ".intent_item .intent_title",
        authorElement: ".intent_item p a",
        imageElement: "",
        dateElement: ".intent_item .intent_publication_date",
        descriptionElement: ".intent_item p:nth-child(4)",
        linkElement: ".intent_item h2 a"
    },
    {
        title: "Taylor & Francis Online",
        description: "E-journal (Open Access) - not working",
        username: "",
        password: "",
        origin: "https://www.tandfonline.com/openaccess/openjournals",
        goto: "https://www.tandfonline.com/action/doSearch?AllField=",
        searchElement: "#advSearch_keyw_for_1",
        titleElement: ".hlFld-Title",
        authorElement: ".author",
        imageElement: "",
        dateElement: ".publication-year",
        descriptionElement: ".publication-meta",
        linkElement: ".hlFld-Title a"
    },
    {
        title: "Wiley Online Library",
        description: "E-book - not working",
        username: "CEBU",
        password: "CEBU12345",
        origin: "https://onlinelibrary.wiley.com/action/showPublications",
        goto: "https://onlinelibrary.wiley.com/action/doSearch?AllField=",
        searchElement: "#searchField1",
        titleElement: ".meta__title",
        authorElement: "",
        imageElement: ".item__image img",
        dateElement: ".meta__details",
        descriptionElement: "",
        linkElement: ".meta__title span a"
    },
]

const Library = () => {
    const [details, setDetails] = useState(
        {
            title: "No site selected", origin: "", 
            description: "", goto: "",
            username: "", password: "",
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
        <div className="flex gap-3 hover:bg-neutral-100 cursor-pointer p-1 hover:underline my-1">
            <img src="/schoolLogo.png" alt="" className="h-12 w-12 " />
            <div className="">
                <h4 className="text-sm font-black">{title}</h4>
                <p className="text-sm">{description}</p>
            </div>
        </div>
    )
}

export default Library

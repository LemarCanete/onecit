'use client'
import React, { useEffect } from 'react'
import puppeteer from 'puppeteer'

const Results = () => {

    // useEffect(()=>{
    //     const fetchData = async() =>{
    //         const browser = await puppeteer.launch()
    //         const page = await browser.newPage();
            
    //     }

    //     fetchData()
    // }, [])

    return (
        <div className='grow px-10 py-5'>
            <h1 className="text-2xl">Library</h1>
            <input type="search" name="" id="" className='w-full border rounded p-2' placeholder='Search title here'/>

        </div>
    )
}

export default Results
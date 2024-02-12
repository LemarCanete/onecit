import React from 'react'
import { FaBell, FaMoon, FaPersonBooth } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";

const DashboardTop = () => {
    return (
        <div className='flex'>
            <input type="search" placeholder='Search' className='grow rounded-xl p-2'/>
            <div className="p-3 bg-white ms-10 rounded-xl cursor-pointer"><FaMoon /></div>
            <div className="p-3 bg-white me-32 ms-3 rounded-xl cursor-pointer"><FaBell /></div>
            <div className="p-3 bg-white mx-1 rounded-xl cursor-pointer"><IoPerson /></div>
        </div>
    )
}

export default DashboardTop
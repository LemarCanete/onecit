import Link from 'next/link';
import React from 'react'
import { TiHome } from "react-icons/ti";
import { BiHelpCircle, BiSolidChat, BiSolidGridAlt  } from "react-icons/bi";
import { IoLogOut, IoSettings } from "react-icons/io5";

const iconStyle = `inline text-3xl text-teal-800 me-2`

const Navbar = () => {
    return (
        <div className='h-full w-fit bg-white p-4 flex flex-col justify-between shadow-xl'>
            <div className="flex flex-col">
                <Link href=""><img src="schoolLogo.png" alt="" className='w-16 inline my-3'/>OneCit</Link>
                <Icon icon={<TiHome className={iconStyle} />} name='Dashboard'/>
                <Icon icon={<BiSolidGridAlt className={iconStyle} />} name="Apps"/>
                <Icon icon={<BiSolidChat className={iconStyle} />} name="Chat"/>
                <Icon icon={<BiHelpCircle className={iconStyle} />} name="Help"/>
                <Icon icon={<IoSettings className={iconStyle} />} name="Settings"/>
            </div>
            <Icon icon={<IoLogOut className={iconStyle} />} name="Logout"/>

        </div>
    )
}

const Icon = ({icon, name}) =>{
    return (
        <Link href={`/${name}`} className='text-black hover:bg-slate-50 p-2 rounded pe-7 text-base'>
            {icon} {name}
        </Link>
    )
}

export default Navbar
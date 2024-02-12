import React from 'react'
import { AiFillHome, AiFillAppstore, AiFillWechat   } from "react-icons/ai";
import { BiLogOutCircle, BiSolidHelpCircle } from "react-icons/bi";
import { AiFillSetting } from "react-icons/ai";
import { useSelector } from 'react-redux';
import Link from 'next/link';

const Navbar = () => {
    const mode = useSelector(state => state.darkMode.value);
    const iconClassName = `inline text-teal-800 text-3xl me-2 ${mode ? 'text-white' : 'text-teal-800'}`
    return (
        <div className={`h-full w-fit p-4 flex flex-col justify-between shadow-xl ${mode ? 'bg-slate-600 text-white': 'bg-white'}`}>
            <div className="flex-col flex ">
                <a href="/" className='w-16 flex items-center mb-7'><img src="schoolLogo.png" alt="" /><span className='font-bold'>OneCIT</span></a>
                <Icon name="Dashboard" icon={<AiFillHome className={iconClassName}/>}/>
                <Icon name="Apps" icon={<AiFillAppstore className={iconClassName} />}/>
                <Icon name="Chat" icon={<AiFillWechat className={iconClassName}/>}/>
                <Icon name="Help" icon={<BiSolidHelpCircle className={iconClassName} />} />
                <Icon name="Settings" icon={<AiFillSetting className={iconClassName}/>} />
            </div>
            <div className="flex-col flex ">
                <Icon name="Logout" icon={<BiLogOutCircle className={`inline text-3xl me-2 ${mode ? 'text-white' : 'text-teal-800'}`}/>} />
            </div>
        </div>
    )
}

const Icon = ({icon, name})=>{
    const mode = useSelector(state => state.darkMode.value);
    return(
        <Link href={`/${name}`} className={`py-2 ps-2 pe-8 rounded hover:bg-slate-50 ${mode ? 'text-white hover:bg-slate-500' : ''}`}>
            {icon}{name}
        </Link>
    )
}


export default Navbar
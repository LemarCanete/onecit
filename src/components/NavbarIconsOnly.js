import React from 'react'
import { AiFillHome, AiFillAppstore, AiFillWechat   } from "react-icons/ai";
import { BiLogOutCircle, BiSolidChat, BiSolidHelpCircle } from "react-icons/bi";
import { VscTypeHierarchySub } from "react-icons/vsc";
import { AiFillSetting } from "react-icons/ai";
import { useSelector } from 'react-redux';
import Link from 'next/link';

const NavbarIconsOnly = ({active}) => {
    const mode = useSelector(state => state.darkMode.value);
    const iconClassName = `inline text-teal-800 text-3xl  ${mode ? 'text-white' : 'text-teal-800'}`

    return (
        <div className={`h-full w-fit flex flex-col justify-between shadow-xl ${mode ? 'bg-slate-600 text-white': 'bg-white'}`}>
            <div className="flex-col flex items-center">
                <a href="/Apps" className='w-16 flex items-center mb-7 mt-4'><img src="/schoolLogo.png" alt="" /></a>
                {/* <Icon name="Dashboard" icon={<AiFillHome className={iconClassName} />} active={active}/> */}
                <Icon name="Apps" icon={<AiFillAppstore className={iconClassName} />} active={active}/>
                {/* <Icon name="Chats" icon={<BiSolidChat className={iconClassName}/>} active={active}/> */}
                {/* <Icon name="Help" icon={<BiSolidHelpCircle className={iconClassName} />} active={active}/> */}
                {/* <Icon name="Settings" icon={<AiFillSetting className={iconClassName}/>} active={active}/> */}
                {/* <Icon name="Directory" icon={<VscTypeHierarchySub className={iconClassName}/>} active={active}/> */}
            </div>
            <div className="flex-col flex ">
                <Icon name="Logout" icon={<BiLogOutCircle className={`inline text-3xl me-2 ${mode ? 'text-white' : 'text-teal-800'}`}/>} />
            </div>
        </div>
    )
}

const Icon = ({icon, name, active})=>{
    const mode = useSelector(state => state.darkMode.value);
    const isActive = `border-s-8 border-teal-800 `

    return(
        <Link href={`/${(name === "Logout") ? "Login" : name}`} 
            className={`px-5 py-2 hover:bg-slate-50 text-base mb-3 ${mode && 'text-white hover:bg-slate-500' } ${(name === active && active !== undefined) && isActive} `}>
            {icon}
        </Link>
    )
}


export default NavbarIconsOnly
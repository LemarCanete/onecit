'use client'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {db} from '../../firebase-config'

import {collection, doc, query, setDoc, where, getDocs} from 'firebase/firestore'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'

const page = () => {
    const [allUsers, setAllUsers] = useState([]);
    useEffect(()=>{
        const fetchData = async() =>{
            try{
                const q = query(collection(db, 'users'))
                let querySnapshot = await getDocs(q);

                const AllUsersResults = querySnapshot.docs.map((doc, id) => {
                    const { uid, ...rest } = doc.data();
                    return { uid, ...rest };
                });
                
                setAllUsers(AllUsersResults)
            }catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [])

    const handleOnSearch = (string, results) => {
        console.log(string, results)
    }

    const formatResult = (item) => {
        return (
          <>
            {/* <span className="block text-left" >id: {item.id}</span> */}
            <span className="block text-left">{item.firstname} {item.lastname}</span>
            <span className='block text-left'>{item.schoolid} | {item.email}</span>
          </>
        )
      }
    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>
            <div className="px-10 py-5 grow">
                <h1 className="text-3xl">Directory</h1>
                <ReactSearchAutocomplete items={allUsers}
                    onSearch={handleOnSearch}
                    autoFocus
                    formatResult={formatResult}
                    fuseOptions={{keys: ['firstname', "lastname", "email", "schoolid"]}}/>

                <div className="">
                    <p className='mt-10 italic '>Results</p>
                    <div className="border">
                        <Result name="Lemar Canete"/>
                    </div>
                </div>
            </div>

        </div>
    )
}

const Result = ({name, position}) => {
    const router = useRouter();
    return(
        <div className="bg-white shadow p-2 cursor-pointer text-sm" onClick={() => router.push("/Directory/Directory2")}>
            <h3 className='font-bold'>{name}</h3>
            <p className=''>{position || "President> College of Engineering and Architecture> Student"}</p>
        </div>
    )
}

export default page 
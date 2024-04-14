'use client'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import React, { useEffect, useState } from 'react'
import {db} from '../../firebase-config'
import { useRouter } from 'next/navigation'
import {collection, query, getDocs} from 'firebase/firestore'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import Result from './Result'
import orgChart from './org'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';


const page = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [siblings, setSiblings] = useState([]);
    const [parent, setParent] = useState(null);
    const router = useRouter();

    useEffect(()=>{
        const fetchData = async() =>{
            try{
                const q = query(collection(db, 'users'))
                let querySnapshot = await getDocs(q);

                const AllUsersResults = querySnapshot.docs.map((doc, id) => {
                    const { uid, ...rest } = doc.data();
                    return { uid, ...rest };
                });
                

                const allPersons = [];
                const extractPersons = (node) => {
                    if (node.name) {
                        allPersons.push({ name: node.name, position: node.position });
                    }
                    if (node.children) {
                        node.children.forEach(child => extractPersons(child));
                    }
                };
                extractPersons(orgChart);
                

                setAllUsers(AllUsersResults, allPersons)

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

    const handleOnSelect = (item) => {
        const foundPerson = findPersonInOrgChart(item.role, item.program);
        console.log(foundPerson)
        if (foundPerson) {
            const { parent, siblings } = extractParentAndSiblings(foundPerson);
            siblings.push(item)
            setParent(parent);
            setSiblings(siblings);
        } else {
            let a = allUsers.filter(user => user.program === item.program && item.role === user.role)
            a.length > 0 ? setSiblings(a) : item;

            let head = findParent(item);
            setParent(head);
        }
    }

    const findPersonInOrgChart = (role, program) => {
        let foundPerson = null;
        const findPersonRecursive = (node) => {
            if (node.position && (node.position.toLowerCase() === role.toLowerCase())) {
                foundPerson = node;
                return;
            }
            if (node.children) {
                node.children.forEach(child => findPersonRecursive(child));
            }
        }
        findPersonRecursive(orgChart);
        return foundPerson;
    }

    const extractParentAndSiblings = (person) => {
        let parent = null;
        let siblings = [];
        const findParentRecursive = (node, targetPerson) => {
            if (node.children) {
                node.children.forEach(child => {
                    if (child === targetPerson) {
                        parent = node;
                        let item = allUsers.filter(user => user.role === node.position)[0]
                        if(item){
                            item.name = node.name
                            item.children = node.children
                        }
                        parent = item ? item : node;
                        return;
                    }
                    findParentRecursive(child, targetPerson);
                });
            }
        };
    
        const extractSiblings = (parentNode, targetPerson) => {
            if (parentNode.children) {
                parentNode.children.forEach(child => {
                    if (child !== targetPerson) {
                        let item = allUsers.filter(user => user.role === child.position)[0]
                        siblings.push(item ? item : child);
                    }
                });
            }
        };
    
        // Find parent of the person
        findParentRecursive(orgChart, person);
    
        // Extract siblings of the person
        if (parent) {
            extractSiblings(parent, person);
        }
        console.log(siblings)
        return { parent, siblings };
    };
    
    const findParent = (item) => {
        let parent = null;
        const findParentRecursive = (node) => {
            if (node.position && node.position.includes(item.program.toUpperCase()) ) {
                let item = allUsers.filter(user => user.role === node.position)[0]
                if(item){
                    item.name = node.name
                }
                parent = item ? item : {name: node.name, position: node.position};
                return;
            }
            if (node.children) {
                node.children.forEach(child => findParentRecursive(child));
            }
        }
        findParentRecursive(orgChart);
        return parent;
    }

    return (
        <div className='w-full h-screen flex bg-neutral-50'>
            <NavbarIconsOnly/>
            <div className="px-10 py-5 grow">
                <div className="flex justify-between items-center">
                    <button onClick={()=>router.back()}>
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                    </button>
                    <h1 className="text-2xl">Directory</h1>
                    <button className="underline " onClick={()=>router.push('/Directory/Directory2')}>Graph</button>
                </div>
                <ReactSearchAutocomplete items={allUsers}
                        onSearch={handleOnSearch}
                        onSelect={handleOnSelect}
                        autoFocus
                        formatResult={formatResult}
                        fuseOptions={{keys: ['firstname', "lastname", "email", "schoolid"], threshold: 0.2}}
                        styling={{ fontSize: "14px", border: "0 0 1px 0 solid #dfe1e5", borderRadius: "0px",  boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 0px 0px"}} 
                        resultStringKeyName="schoolid"/>

                <div className="">
                    <p className='mt-10 italic '>Results</p>

                    <div className="w-4/6 mx-auto">
                        {parent && <Result name={parent.name} program={parent.position} user={parent}/>}    
                    </div>                    


                    <hr className='mx-16 my-10'/>
                    <div className="grid grid-cols-5 gap-5">
                        {siblings.map((sibling, key) => {
                            return (
                                <Result key={key} name={sibling.name ? sibling.name : `${sibling.firstname} ${sibling.lastname}`} program={sibling.program ? sibling.program : sibling.position} user={sibling}/>
                            )
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}



export default page 
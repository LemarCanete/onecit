'use client'
import { useRef, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {auth, db} from '../../firebase-config'
import {doc, setDoc} from 'firebase/firestore'
import React from 'react'
import Link from 'next/link'

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const frameworks = [
  {
    value: "bscpe",
    label: "BSCpE",
  },
  {
    value: "bsee",
    label: "BSEE",
  },
  {
    value: "bsche",
    label: "BSChE",
  },
  {
    value: "bsie",
    label: "BSIE",
  },
  {
    value: "bsce",
    label: "BSCE",
  },
]


const LoginForm = ({email, password}) => {
 return (
    <div className='w-1/2'>
        <div className='m-5 w-full'>
          <div className='flex flex-col m-5'>
            <label className='font-semibold my-1'>Email</label>
            <input type='email' value={email} placeholder='juandelacruz@gmail.com' className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
          </div>
          
          <div className='flex flex-col m-5'>
            <label className='font-semibold my-1'>Password</label> 
            <input type='password' value={password} placeholder='Enter Password' className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            <a href='#' className='flex flex-row-reverse text-sm py-1.5 font-semibold'>
              Forgot password?
            </a>
          </div>
        </div>

    <div className='flex flex-row-reverse w-full'>
      <button
        className='bg-[#00687B] h-[45px] w-1/4 rounded-[15px]
          text-white font-semibold'
        onClick={() => {}}>
        <Link href="/Dashboard">
        Log In
        </Link>
      </button>
    </div>
  </div>
 );
};

const SignupForm = () => {
  const [id, setId] = useState('');
  const [program, setProgram] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [birthdate, setBirthdate] = useState();
  const [birthdateError, setBirthdateError] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [uid, setUid] = useState('');
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  

  const handleIdChange = (e) => {
    const value = e.target.value;
    
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format the numeric value as 00-0000-00
    const formattedValue = numericValue
      .replace(/(\d{2})(\d{4})(\d{2})/, '$1-$2-$3')
      .slice(0, 11); // Limit to 00-0000-00 format
    
    // Update the state with the formatted value
    setId(formattedValue);
  };

  const handleBirthdateChange = (e) => {
    const value = e.target.value;
    
    // Remove any non-numeric characters
    const numericValue = value.replace(/\D/g, '');
  
    // Format the numeric value as MM/DD/YYYY
    const formattedValue = numericValue
      .replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3')
      .slice(0, 10); // Limit to MM/DD/YYYY format
    
    // Update the state with the formatted value
    setBirthdate(formattedValue);
    
    // Clear any previous error message
    setBirthdateError('');
  };

  const handleSignUp =  (e) => {
    e.preventDefault()

    if(password!==confirmpassword) {
      console.log("Passwords don't match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        console.log("User created! UserID: " + userId)
        setUid(userId);
        
        setDoc(doc(db, "users", userId), {
          schoolid: id,
          program: program,
          lastname: lastname,
          firstname: firstname,
          birthdate: birthdate,
          email: email,
          uid: uid
        })
        
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Errocode: " + errorCode + " Error Message: " + errorMessage)
      })

    
  }

  return (
    <div>
      <div className='w-full'>
          <div className='flex flex-row mt-10'>
            <div className='flex flex-col mx-2.5 w-1/3'>
              <label className='font-semibold my-1'>ID</label>
              <input 
                type='string' value={id}
                placeholder='00-000-000'
                onChange={handleIdChange}
                className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            </div>
            <div className='flex flex-col mx-2.5 w-2/3'>
              <label className='font-semibold my-1'>Program</label>

              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {value
                      ? frameworks.find((framework) => framework.value === value)?.label
                      : "Select program..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-100 bg-white">
                  <Command>
                    <CommandInput placeholder="Search program..." className="h-9" />
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                      {frameworks.map((framework) => (
                        <CommandItem
                          key={framework.value}
                          value={framework.value}
                          onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                            setProgram(currentValue); 
                          }}
                        >
                          {framework.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              value === framework.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className='flex flex-row mt-5'>
            <div className='mx-2.5 w-3/5'>
              <label className='font-semibold my-1'>First Name</label> 
              <input
                type='string' value={firstname} 
                placeholder='Juan' 
                onChange={e => setFirstname(e.target.value)}
                className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            </div>
            <div className='mx-2.5'>
              <label className='font-semibold my-1'>Last Name</label> 
              <input
                type='string' value={lastname} 
                placeholder='Dela Cruz' 
                onChange={e=>setLastname(e.target.value)}
                className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            </div>
          </div>

          <div className='flex flex-row mt-5'>
            <div className='mx-2.5 w-1/2'>
              <label className='font-semibold my-1'>Email</label> 
              <input
                type='email' value={email}
                placeholder='juandelacruz@gmail.com' 
                onChange={e=>setEmail(e.target.value)}
                className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            </div>
            <div className='mx-2.5 w-1/2'>
              <label className='font-semibold my-1'>Birthdate</label> 
              <input
                type='text'
                value={birthdate}
                onChange={handleBirthdateChange}
                placeholder='MM/DD/YYYY'
                className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              />
            </div>
          </div>

          <div className='flex flex-row mt-5'>
            <div className='mx-2.5 w-1/2'>
              <label className='font-semibold my-1'>Password</label> 
              <input 
                type='password' value={password}
                placeholder='Password' 
                onChange={e=>setPassword(e.target.value)}
                className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            </div>
            <div className='mx-2.5 w-1/2'>
              <label className='font-semibold my-1'>Confirm Password</label> 
              <input 
                type='password' value={confirmpassword} 
                placeholder='Password'
                onChange={e=>setConfirmpassword(e.target.value)}
                className='block px-5 w-full rounded-[10px] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'/>
            </div>
          </div>

          <div className='flex flex-row-reverse w-full mt-20'>
            <button
              className='bg-[#00687B] h-[45px] w-1/4 rounded-[15px]
                text-white font-semibold'
              onClick={handleSignUp}>
              <Link href="">
              Sign Up
              </Link>
            </button>
          </div>
        </div>
    </div>
  );
};

const Login = () => {
  const [showLoginForm, setShowLoginForm] = useState(true)

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
  }

  return (
    <div className="flex h-screen w-screen bg-slate-50">
        <div className='bg-slate-50 w-full flex flex-col items-center justify-center'>
          <div className='flex justify-between w-1/3 text-[#435A7F]'>
            <h1 className={` cursor-pointer ${showLoginForm ? 'log-in-mode' : 'idle-mode'}`} onClick={toggleForm}>Log In</h1>
            <h1 className={` cursor-pointer ${!showLoginForm ? 'log-in-mode' : 'idle-mode'}`} onClick={toggleForm}>Sign Up</h1>
          </div>

          {showLoginForm ? <LoginForm/> : <SignupForm/>}

        </div>

        <div className='bg-[#00687B] w-screen'>
          <div className='h-screen flex flex-col justify-center items-center'>
            <img src="schoolLogo.png" className='w-1/2' />
            <label className='one-cit-1'>OneCIT</label>
            <label className='one-cit-2'>Explore. Connect. Succeed.</label>
          </div>
        </div>
    </div>
  )
}

export default Login

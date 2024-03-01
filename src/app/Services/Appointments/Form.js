import React from 'react'

const Form = ({setIsOpen, name}) => {
    return (
        <div className='p-5 relative flex flex-col w-96'>
            <h1 className='text-lg font-bold text-center p-3'>{name}</h1>

            <span className='absolute top-0 right-0 text-lg cursor-pointer' onClick={()=>setIsOpen(false)}>X</span>
            <label htmlFor="schoolid">School ID</label>
            <input type="text" id='schooldid' className='border p-2 text-sm'/>

            <label htmlFor="phonenumber">Phonenumber</label>
            <input type="text" id='phonenumber' className='border p-2 text-sm'/>

            <label htmlFor="date">Date</label>
            <input type="datetime-local" id="date" className='border p-2 text-sm'/>

            <label className="" htmlFor='reason'>Reason for visit</label>
            <textarea name="" id="reason" cols="30" rows="10" className='border p-2 text-sm'></textarea>

            <button className='p-3 bg-amber-400 my-2 hover:bg-amber-600 text-white'>Book Now</button>
        </div>
    )
}

export default Form
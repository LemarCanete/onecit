import React from 'react'

const DeleteAccount = () => {
    const handleDelete = () =>{

    }
    return (
        <div className='text-sm py-5 border-b flex flex-col gap-1'>
            <h1 className="text-base font-semibold">Delete Account</h1>
            <p className=''>Deleting this account may Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rerum, laborum.</p>

            <button className="bg-red-500 px-5 rounded-lg text-white py-2 w-20" onClick={handleDelete}>Delete</button>
        </div>
    )
}

export default DeleteAccount
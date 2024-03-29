import React from 'react'

const Password = () => {
    const handleUpdate = () =>{

    }
    return (
        <div className='text-sm my-5 grid grid-cols-2 gap-10'>
            <div className="">
                <h1 className="text-base font-semibold">Change Password</h1>
                <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, quisquam!</p>
                <div className="grid grid-cols-2 gap-10 my-5">
                    <label className="">Current Password</label>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Current Password'/>
                </div>

                <div className="grid grid-cols-2 gap-10 my-5">
                    <label className="">New Password</label>
                    <input type="text" className="border p-2 rounded-lg" placeholder='New Password'/>
                </div>

                <div className="grid grid-cols-2 gap-10 my-5">
                    <label className="">Confirm Password</label>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Confirm Password'/>
                </div>

                <div className="flex justify-end gap-5">
                    <button className="bg-neutral-500 px-5 rounded-lg text-white py-2 " onClick={handleUpdate}>Forgot Password?</button>
                    <button className="bg-teal-500 px-5 rounded-lg text-white py-2 " onClick={handleUpdate}>Save</button>
                </div>
            </div>
            <div className="border p-10 flex flex-col justify-center">
                <p className="">To change yoour password , please fill in the fields. Your password must contain at least: </p>
                <ul className='list-disc list-inside'>
                    <li>8 characters</li> 
                    <li>at least one upper case letter</li>
                    <li>one lowercase letter</li>
                    <li>one number</li>
                    <li>one special character.</li>
                </ul>
            </div>
        </div>
    )
}

export default Password

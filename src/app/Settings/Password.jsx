import React, { useContext, useState } from 'react'
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, signInWithEmailAndPassword, updatePassword } from "firebase/auth";
import { AuthContext } from '@/context/AuthContext';

const Password = () => {
    const {currentUser} = useContext(AuthContext)
    // const auth = getAuth();
    // const user = auth.currentUser;
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleUpdate = (pass, auth) =>{
        try{
            const user = auth.currentUser;
            const newPassword = pass;
            
            updatePassword(user, newPassword).then(() => {
                alert("Successful password update!")
            }).catch((error) => {
                alert("Error: " + error.message)
            });
        }catch(err){
            alert(err.message)
        }

    }

    const checkNewPassword = async () => {
        if (newPassword !== confirmNewPassword) {
            alert("New Passwords do not match!");
            return;
        }else if(newPassword === ""){
            alert("No password!");
            return;
        }else if(currentPassword === newPassword){
            alert("The password is the same as the current password. Pls change your new password!");
            return;
        }

        try {
            const auth = getAuth();

            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(auth.currentUser, credential);
            alert("Re-authenticated successfully!");
            handleUpdate(newPassword, auth)
        } catch (err) {
            alert("Invalid Credential! Error: " + err.message);
        }
    }
    

    return (
        <div className='text-sm my-5 grid grid-cols-2 gap-10'>
            <div className="">
                <h1 className="text-base font-semibold">Change Password</h1>
                <p className="">Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero, quisquam!</p>
                <div className="grid grid-cols-2 gap-10 my-5">
                    <label className="">Current Password</label>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Current Password' value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/>
                </div>

                <div className="grid grid-cols-2 gap-10 my-5">
                    <label className="">New Password</label>
                    <input type="text" className="border p-2 rounded-lg" placeholder='New Password' value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
                </div>

                <div className="grid grid-cols-2 gap-10 my-5">
                    <label className="">Confirm New Password</label>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Confirm Password' value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)}/>
                </div>

                <div className="flex justify-end gap-5">
                    <button className="bg-neutral-500 px-5 rounded-lg text-white py-2 " onClick={checkNewPassword}>Forgot Password?</button>
                    <button className="bg-teal-500 px-5 rounded-lg text-white py-2 " onClick={checkNewPassword}>Save</button>
                </div>
            </div>
            <div className="border p-10 flex flex-col justify-center">
                <p className="">To change yoour password , please fill in the fields. Your password must contain at least: </p>
                <ul className='list-disc list-inside'>
                    <li>6 characters</li> 
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

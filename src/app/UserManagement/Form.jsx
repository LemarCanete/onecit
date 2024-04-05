import { doc, getDocs, updateDoc, where, query, collection, setDoc } from 'firebase/firestore';
import React, { useState } from 'react'
import { db, auth } from '@/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';


const Form = ({user, title}) => {
    
    const initialUserData = user ? user[0] : {};

    const [uid, setUid] = useState("")
    const [schoolid, setSchoolid] = useState(initialUserData.schoolid || "");
    const [program, setProgram] = useState(initialUserData.program || "");
    const [firstname, setFirstname] = useState(initialUserData.firstname || "");
    const [lastname, setLastname] = useState(initialUserData.lastname || "");
    const [email, setEmail] = useState(initialUserData.email || "");
    const [birthdate, setBirthdate] = useState(initialUserData.birthdate || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("")
    const [errors, setErrors] = useState("")


    const addUser = async() =>{
        if (!schoolid || !program || !firstname || !lastname || !email || !birthdate || !password) {
            
            setMessage('Some credentials are missing.');
            setTimeout(() => {
                setErrors({});
                setMessage('');
            }, 6000);
            return;
            }    
    
            if(password!==confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: 'Passwords do not match',
            }));
            setMessage('Passwords do not match.');
            setTimeout(() => {
                setErrors((prevErrors) => ({
                ...prevErrors,
                password: '',
                }));
                setMessage('');
            }, 6000);
            return;
            }
    
            const checkIdExists = async (schoolid) => {
            try {
                const q = query(collection(db, 'users'), where('schoolid', '==', schoolid));
                const querySnapshot = await getDocs(q);
    
                return !querySnapshot.empty;
            } catch (error) {
                console.log("Error fetching user data: ", error)
                throw error
            }
            }
    
            try {
            const exists = await checkIdExists(schoolid);
    
            if (exists) {
                setErrors((prevErrors) => ({
                ...prevErrors,
                id: 'ID already exists.',
                }));
                setMessage('ID already exists. Please seek assistance in retrieving your account.');
                setTimeout(() => {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    schoolid: '',
                }));
                setMessage('');
                }, 6000);
                return;
            }
    
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userId = user.uid;
            console.log("User created! UserID: " + userId)
            setUid(userId);
            
            await setDoc(doc(db, "users", userId), {
                schoolid: schoolid,
                program: program,
                lastname: lastname,
                firstname: firstname,
                birthdate: birthdate,
                email: email,
                uid: userId,
                role: 'student'
            }).then(async() => {
                alert("Successfully added user!")
                console.log("Registration Successful", userCredential)
                await setDoc(doc(db, "userChats", user.uid), {})
    
            }).catch((error) => {
                console.error("Error setting document: ", error);
            });
            
            
            } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
    
            if (errorCode === "auth/email-already-in-use") {
                setErrors((prevErrors) => ({
                ...prevErrors,
                email: 'Email is already in use.',
                }));
                setMessage('Email is already in use.');
                setTimeout(() => {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    email: '',
                }));
                setMessage('');
                }, 6000);
                return;
            }
    
                console.log("Errocode: " + errorCode + " Error Message: " + errorMessage);
            }
    }

    return (
        <div className="text-sm">
            <h1 className="text-center tracking-wide font-bold text-base">Add a User</h1>

            <div className="grid grid-cols-2 gap-5 my-5 ">
                <div className="">
                    <p className="">ID</p>
                    <input type="text" className="border p-2 rounded-lg" placeholder='00-000-000'  value={schoolid} onChange={(e)=>setSchoolid(e.target.value) }/>
                </div>
                <div className="">
                    <p className="">Program</p>
                    <select name="" id="" className='border w-full p-2 rounded-lg' value={program} onChange={(e)=>setProgram(e.target.value) }>
                        <option value=""></option>
                        <option value="bscpe">BSCpE</option>
                        <option value="bsee">BSEE</option>
                        <option value="bsche">BSChE</option>
                        <option value="bsie">BSIE</option>
                        <option value="bsee">BSCE</option>
                    </select>
                </div>
                <div className="">
                    <p className="">First Name</p>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Firstname' value={firstname} onChange={(e)=>setFirstname(e.target.value) }/>
                </div>
                <div className="">
                    <p className="">Last Name</p>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Lastname' value={lastname} onChange={(e)=>setLastname(e.target.value) }/>
                </div>
                <div className="">
                    <p className="">Email</p>
                    <input type="email" className="border p-2 rounded-lg" placeholder='Email' value={email} onChange={(e)=>setEmail(e.target.value) }/>
                </div>
                <div className="w-full">
                    <p className="">Birthdate</p>
                    <input type="text" className="border p-2 rounded-lg w-full" placeholder='03/31/2024' value={birthdate} onChange={(e)=>setBirthdate(e.target.value) }/>
                </div>
                {!user && <>
                <div className="">
                    <p className="">Password</p>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Password' value={password} onChange={(e)=>setPassword(e.target.value) }/>
                </div>
                <div className="">
                    <p className="">Confirm Password</p>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Confirm Password' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value) }/>
                </div>
                </>}
                
                {message}
                {errors}
                <button className="bg-teal-500 px-5 rounded-lg text-white py-2 col-span-2" onClick={addUser}>Save</button>
            </div>
        </div>
    )
}

export default Form
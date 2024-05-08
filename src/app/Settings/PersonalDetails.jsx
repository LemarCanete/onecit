import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase-config";
import React, { useState, useRef, useContext } from "react"
import { BsUpload } from "react-icons/bs";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { AuthContext } from "@/context/AuthContext";

const formatDate = (dateString) => {
    const parts = dateString.split('/');
    return `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
};

const PersonalDetails = ({userData}) => {
    const [firstname, setFirstname] = useState(userData.firstname)
    const [lastname, setLastname] = useState(userData.lastname)
    const [email, setEmail] = useState(userData.email)
    const [year, setYear] = useState(userData?.year || '')
    const [birthdate, setBirthdate] = useState(formatDate(userData.birthdate));
    const [role, setRole] = useState(userData.role)
    const [program, setProgram] = useState(userData.program)
    const [schoolid, setSchoolid] = useState(userData.schoolid)
    const [bio, setBio] = useState(userData?.bio || '')
    const [file, setFile] = useState(null)
    const fileInputRef = useRef(null);
    const {currentUser} = useContext(AuthContext)
    console.log(year)
    const handleUpdate = async() =>{
        try{
            const q = doc(db, "users", userData.uid);

            await updateDoc(q, {
                firstname: firstname,
                lastname: lastname,
                email: email,
                program: program,
                schoolid: schoolid,
                bio: bio,
                role: role,
                year: year === "" ? '' : Number(year)
            });

            alert("Successfull Update")
        }catch(err){
            alert(err.message)
        }
    }

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleUploadImage = () =>{
        if (!file || !file.type.startsWith('image/')) {
            setFile(null)            
            alert("Please select an image file.");
            return;
        }

        const storage = getStorage();

        const metadata = {
            contentType: 'image/jpeg'
        };

        const storageRef = ref(storage, 'profileImages/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                }
            }, 
        (error) => {
            switch (error.code) {
            case 'storage/unauthorized':
                alert("User doesn't have permission to access the object")
                break;
            case 'storage/canceled':
                alert("User canceled the upload")
                break;

            case 'storage/unknown':
                alert("Unknown error occurred, inspect error.serverResponse")
                break;
            }
        }, 
        () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                    console.log('File available at', downloadURL);

                    const usersRef = doc(db, "users", userData.uid);

                    await updateDoc(usersRef, {
                        profileImagesUrl: arrayUnion(downloadURL)
                    });
                });
                setFile(null)
            }
        );
    }
    
    const changeUserProfile = (url) =>{
        const auth = getAuth();
        const userRef = doc(db, "users", userData.uid);

        updateProfile(auth.currentUser, {
            displayName: `${userData.firstname} ${userData.lastname}`, photoURL: `${url}`
          }).then(async() => {
            console.log(auth.currentUser)

            await updateDoc(userRef, {
                photoURL: url,
            });

            alert("Successful Profile Update!");
          }).catch((error) => {
            alert(error.message)
          });
    }

    

    return (
        <div className='my-4 text-sm flex h-5/6'>
            <div className="w-96 border-e h-full pe-4">
                <h1 className="font-semibold text-base">Profile Picture</h1>
                <div className="flex flex-col justify-center">
                    <label htmlFor="profile"  className="cursor-pointer w-full mx-auto hover:brightness-75">
                        {/* <BsUpload className="cursor-pointer absolute text-4xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white hover:brightness-150"/> */}
                        <img src={userData.photoURL ? userData.photoURL : './schoolLogo.png'} className='w-48 h-48 mx-auto rounded-full' id="profile" alt="Profile"  onClick={handleImageClick}/>
                    </label>
                    <input type="file" id="profile" className="hidden" ref={fileInputRef} onChange={(e)=>setFile(e.target.files[0])}/>
                    {file && (
                        <div className="justify-self-end">
                            <span className="underline px-3">{file.name}</span> 
                            <button className="border bg-teal-500 text-white px-4 py-2 rounded-lg" onClick={handleUploadImage}>Upload</button>
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <p className="py-3">Saved Pictures</p>
                    <div className="grid grid-cols-6 gap-1">
                        {userData.profileImagesUrl && userData.profileImagesUrl.map((url, id)=>{
                            return <img key={id} src={url} className='cursor-pointer border' onClick={()=>changeUserProfile(url)}/>
                        })}
                    </div>
                </div>
            </div>
            <div className="grow px-3">
                <div className="mb-5">
                    <h1 className="text-base font-semibold">Personal Details</h1>
                    <p className="text-black/50">Update your photo and personal details here</p>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5">
                    <p className="">Name</p>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Firstname' value={firstname} onChange={(e)=> setFirstname(e.target.value)}/>
                    <input type="text" className="border p-2 rounded-lg" placeholder='Lastname' value={lastname} onChange={(e)=> setLastname(e.target.value)}/>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5">
                    <p className="">School ID</p>
                    <input type="text" className="border p-2 rounded-lg"  value={schoolid} onChange={e=>setSchoolid(e.target.value)} disabled={currentUser.role === "admin" ? false : true}/>
                    <p className="">Role</p>
                    <input type="text" className="border p-2 rounded-lg"  value={role} onChange={e=>setRole(e.target.value)} disabled={currentUser.role === "admin" ? false : true}/>
                </div>
                <hr />
                <div className="grid grid-cols-4 my-5 gap-10">
                    <p className="">Program</p>
                    <input type="text" className="border p-2 rounded-lg"  value={program} onChange={(e)=> setProgram(e.target.value)} disabled={currentUser.role === "admin" ? false : true}/>
                    <p className="">Year</p>
                    <input type="text" className="border p-2 rounded-lg" value={year} onChange={(e)=> setYear(e.target.value)} disabled={currentUser.role === "admin" ? false : true}/>
                </div>
                <hr />
                <div className="grid grid-cols-4 gap-10 my-5">
                    <p className="">Email Address</p>
                    <input type="email" className="border p-2 rounded-lg" placeholder='Email Address' disabled={currentUser.role === "admin" ? false : true} value={email} onChange={(e)=> setEmail(e.target.value)}/>
                    <p className="">Birth Date</p>
                    <input type="date" className="border p-2 rounded-lg"  value={birthdate} onChange={(e)=> setBirthdate(e.target.value)}/>
                    
                </div>
                <hr />
                <div className="flex w-full justify-between my-5 gap-10">
                    <p className="">Bio</p>
                    <textarea name="" id="" cols="120" rows="4" className='border resize-none p-2 rounded-lg' value={bio} onChange={(e)=> setBio(e.target.value)}></textarea>
                </div>

                <button className="float-right bg-teal-500 px-5 rounded-lg text-white py-2" onClick={handleUpdate}>Save</button>
            </div>
            
        </div>
    )
}

export default PersonalDetails
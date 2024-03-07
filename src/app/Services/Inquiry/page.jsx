'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import RadioButton from './RadioButton';
import GuideData from './GuideData';
import './inquiry.css';
import { Timestamp, addDoc, arrayUnion } from 'firebase/firestore';
import { db, storage } from '@/firebase-config';
import { useCookies } from 'react-cookie';
import {v4 as uuid} from "uuid"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const page = () => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [subject, setSubject] = useState('');
  const [generatedId, setGeneratedId] = useState('')

  const handlegoback = () => {
    window.history.back();
  }
  
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    const fileList = Array.from(e.target.files);
    setFiles(fileList);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const truncateFileName = (fileName, maxLength) => {
    if (fileName.length > maxLength) {
      return fileName.substring(0, maxLength / 2) + '...' + fileName.substring(fileName.length - maxLength / 2);
    }
    return fileName;
  };

  const uploadFilesToStorage = async (id) => {
    // Define the folder path in Firebase Storage

    const filePromises = files.map((file) => {
      // Create a reference to the folder path
      const storageRef = ref(storage, `attachments/${id}/${file.name}`);
      
      // Upload the file to the specified folder
      return uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef));
    });
  
    // Wait for all uploads to complete and get the download URLs
    const downloadURLs = await Promise.all(filePromises);
    return downloadURLs;
  };
  
  


  const [showState, setShowState] = useState({});
  const [selectedoption, setSelectedOption] = useState({
    email: '',
    subject: '',
    header: '',
  });

  const toggleShow = (header) => {
    // If the clicked header is already visible, hide it
    if (showState[header]) {
      setShowState(prevState => ({
        ...prevState,
        [header]: false
      }));
    } else {
      // Show the clicked header and hide others
      const updatedState = {};
      Object.keys(showState).forEach(key => {
        updatedState[key] = false;
      });
      updatedState[header] = true;
      setShowState(updatedState);
    }
  };


  const handleOptionChange = (selectedOption, header, email) => {
    const newOption = {
      header: header,
      email: email,
      subject: selectedOption,
    };

    setSelectedOption(newOption);
    setSubject(selectedOption);
  };

  const handleAdditionalSubject = (event) => {
    setSubject(event.target.value);
  }

  useEffect(() => {
    if (!currentUser) {
        router.push('/login');
    } else {
        console.log("User logged in:", currentUser);
    }

    console.log("Selected option: ", selectedoption);
  }, [currentUser, router]);

  const [content, setContent] = useState('');

  const handleInquiryChange = (event) => {
    setContent(event.target.value)
  }

  const handleSendEmail = async () => {
    if (!selectedoption.email || !subject || !content) {
      setErrors({
        recipient: !selectedoption.email ? 'recipient' : '',
        subject: !subject ? 'subject' : '',
        content: !content ? 'content' : '',
      });
      return;
    }
  
    try {
      setGeneratedId(uuid())
      // Upload files to Firebase Storage and obtain download URLs
      const downloadURLs = await uploadFilesToStorage(generatedId);
  
      // Construct document data
      const docData = {
        recipient: selectedoption.email,
        subject: subject,
        inquiries: arrayUnion({
          id: generatedId,
          message: content,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          attachments: downloadURLs // Use the obtained download URLs here
        })
      };
  
      // Log document data
      console.log(docData);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  


  return (
    <div className={`w-full h-screen flex bg-neutral-100`}>
      <NavbarIconsOnly/>
      <div className='w-full h-full flex flex-col'>
        <div className='flex flex-row w-full h-[45px] py-10 items-center px-2'>
          <button onClick={handlegoback}>
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>
          </button>
          Go back
        </div>

        <div className='flex flex-1 w-full'>

          {/*child 1 */}
          <div className='flex h-full flex-col w-full justify-center items-center mx-10'>
            <div className='flex flex-col w-full py-1'>
              <label>Recipient</label>
              <input
                className={`${errors['recipient'] || errors['form'] ? 'border-2 border-red-600 ring-gray-300 focus:ring-indigo-600' : 'border-0 ring-gray-300 focus:ring-indigo-600'} block px-5 w-full rounded-[10px]  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                value={selectedoption.email}
                name='recipient'
              />
            </div>
            <div className='flex flex-col w-full py-1'>
              <label>Subject</label>
              <input
                className={`${errors['subject'] || errors['form'] ? 'border-2 border-red-600 ring-gray-300 focus:ring-indigo-600' : 'border-0 ring-gray-300 focus:ring-indigo-600'} block px-5 w-full rounded-[10px]  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
                value={subject}
                onChange={handleAdditionalSubject}
                name='subject'
              />
            </div>
            <div className='flex flex-col w-full py-1'>
              <label>Message/Inquiry</label>
              <textarea
                rows={5}
                name='content'
                value={content}
                onChange={handleInquiryChange}
                className={`${errors['subject'] || errors['form'] ? 'border-2 border-red-600 ring-gray-300 focus:ring-indigo-600' : 'border-0 ring-gray-300 focus:ring-indigo-600'} resize-none block px-2 w-full rounded-[10px]  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
              />
            </div>
            <div className='flex w-full py-1'>
              <div className='w-full'>
                <div className='h-[90px] overflow-y-auto scrollbar'>
                  {files.length === 0 ? (
                  <div>No files attached</div>
                  ) : (
                    <ul className="list-none">
                      {files.map((file, index) => (
                        <li key={index} title={file.name} className="mb-1.5 rounded-[10px] px-1.5 flex items-center justify-between my-1.5 bg-white hover:bg-[#115E59] text-black hover:text-white transition-all">
                          <span>{truncateFileName(file.name, 30)}</span>
                          <CloseRoundedIcon onClick={() => removeFile(index)} className="ml-2 cursor-pointer" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              <div className='flex w-full justify-end content-center'>
                <label htmlFor="fileInput" className='flex content-center text-[#115E59] hover:text-[#883138] cursor-pointer transition-all'>
                  Add attachments
                  <input id="fileInput" type="file" multiple onChange={handleFileChange} className="hidden" />
                  <AddBoxRoundedIcon className='mx-2'/>
                </label>
              </div>
            </div>

            <div className='w-full flex justify-end mt-[30px]'>
              <button 
              onClick={handleSendEmail}
              className='bg-[#115E59] hover:bg-[#883138] rounded-[10px] shadow-sm py-1.5 px-2.5 text-white flex items-center transition-all'>
                Send
                <SendRoundedIcon
                  className='ml-1.5'
                />
              </button>
            </div>

          </div>

          {/*child2*/}
          <div className='p-[30px] flex w-full justify-center items-center'>

            <div className='w-full flex flex-col'>
              {GuideData.map((data, index) => (
                <div key={index}>
                  <div
                    onClick={() => toggleShow(data.header)} 
                    className={`${showState[data.header] ? 'bg-[#115E59] shadow-lg text-white' : 'text-black'} hover:bg-[#115E59] hover:shadow-lg hover:text-white cursor-pointer h-[40px] flex items-center font-bold px-[10px] rounded-[10px] mt-1.5 transition-all`}>
                    {data.header}
                    <div className='font-light ml-[10px] text-sm'>
                    ({data.email})
                    </div>
                    {showState[data.header] ? 
                      <ExpandMoreRoundedIcon className='flex justify-between ml-auto'/> :
                      <ExpandLessRoundedIcon className='flex justify-between ml-auto'/>
                    }
                  </div>

                  <div className={`${showState[data.header] ? '' : 'hidden'} bg-white p-[10px] rounded-[10px] shadow-md`}>
                    <RadioButton
                      options={data.options}
                      selectedOption={selectedoption}
                      onOptionChange={(selectedOption) => handleOptionChange(selectedOption, data.header, data.email)}
                    />
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default page

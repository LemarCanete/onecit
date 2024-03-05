'use client'
import React, { useEffect, useState } from 'react'
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

const page = () => {
  function checkAuthentication() {
    // Implement your authentication check logic here
    // For example, you can check if the user is logged in by verifying if the authentication token exists
    const authToken = localStorage.getItem('authToken'); // Assuming you store the authentication token in localStorage
    
    if (!authToken) {
        // Authentication token not found, user is not logged in
        console.log("User is not logged in.");
        // Redirect the user to the login page or perform any necessary action
        // window.location.href = '/login'; // Example of redirecting to the login page
        return false;
    } else {
        // Authentication token found, user is logged in
        console.log("User is logged in.");
        return true;
    }
  }

  // Call the function to check authentication on page load
  checkAuthentication();

  const [errors, setErrors] = useState('')

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

  const [showState, setShowState] = useState({});
  const [option, setOption] = useState({});

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

    setOption(newOption);
  };

  useEffect(() => {
    console.log("Selected option: ", option);
  })

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
              />
            </div>
            <div className='flex flex-col w-full py-1'>
              <label>Subject</label>
              <input
                className={`${errors['subject'] || errors['form'] ? 'border-2 border-red-600 ring-gray-300 focus:ring-indigo-600' : 'border-0 ring-gray-300 focus:ring-indigo-600'} block px-5 w-full rounded-[10px]  py-1.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6`}
              />
            </div>
            <div className='flex flex-col w-full py-1'>
              <label>Message/Inquiry</label>
              <textarea
                rows={5}
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
              <button className='bg-[#115E59] hover:bg-[#883138] rounded-[10px] shadow-sm py-1.5 px-2.5 text-white flex items-center transition-all'>
                Send
                <SendRoundedIcon className='ml-1.5'/>
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
                      selectedOption={option}
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

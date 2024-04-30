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
import { Timestamp, addDoc, arrayUnion, collection, doc, limit, onSnapshot, or, orderBy, query, setDoc, where, deleteDoc, getDocs } from 'firebase/firestore';
import { db, storage } from '@/firebase-config';
import {v4 as uuid} from "uuid"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { DataGrid, GridActionsCellItem, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Modal from 'react-modal'
import Message from './Message';
import DeleteIcon from '@mui/icons-material/Delete';

const Inquiry = () => {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('')
  const [showInbox, setShowInbox] = useState('')
  const [parameters, setParameters] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [showState, setShowState] = useState({});
  const [selectedoption, setSelectedOption] = useState({
    email: '',
    subject: '',
    header: '',
  });
  const [rows, setRows] = useState([])


  Modal.setAppElement("body")

  const rowclickhandler = (params) => {
    const rowdata = params.row;
    setIsOpen(true)
    setParameters(rowdata)
    console.log("Row is clicked. Params.row value: ", rowdata)
  }

  const handlegoback = () => {
    window.history.back();
  }

  const handleRightPanelSwitch = () => {
    if(!showInbox) setShowInbox('Show Inbox');
    else setShowInbox('');
  }
  

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
      const storageRef = ref(storage, `inquiries/attachments/${id}/${file.name}`);
      
      // Upload the file to the specified folder
      return uploadBytes(storageRef, file).then(() => getDownloadURL(storageRef));
    });
  
    // Wait for all uploads to complete and get the download URLs
    const downloadURLs = await Promise.all(filePromises);
    return downloadURLs;
  };

  const toggleShow = (header) => {
    if (showState[header]) {
      setShowState(prevState => ({
        ...prevState,
        [header]: false
      }));
    } else {
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

  const handleDeleteClick = async (id) => {
    console.log('Delete clicked for id:', id);

    try {
      /*const docRef = doc(db, 'inquiries', id)

      const q = query(collection(db, 'inquiries'), where('inquiryid', '==', id))
      const querySnapshot = await getDocs(q)

      await deleteDoc(docRef);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref)
      })*/
    } catch (error) {
      console.log("Error captured while trying to delete: ", error)
    }
  };

  const columns = [
    { field: 'recipient', headerClassName: 'header', headerName: 'Recipient', flex: 0.2},
    { field: 'subject', headerClassName: 'header', headerName: 'Subject', flex: 0.3},
    { field: 'date', headerClassName: 'header', headerName: 'Date', flex: 0.2},
    { field: 'time', headerClassName: 'header', headerName: 'Time', flex: 0.2},
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      flex: 0.1,
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteClick(id)}
            //color="black"
          />
        ]
      },
    },
  ]
  
// SAMPLE HERE
  useEffect(() => {
    if (currentUser && currentUser.uid) {
      let q = '';
      if (currentUser.role === 'admin'){
        q = query(
          collection(db, "inquiries")
        )
      }
      else {
        q = query(
          collection(db, "inquiries"), 
          or(
            where('senderId', '==', currentUser.uid),
            where('recipient', '==', currentUser.email)
          )
        )
      }

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const retrievedrows = [];
        querySnapshot.forEach((doc) => {
          retrievedrows.push({
            id: doc.data().inquiryid, 
            recipient: doc.data().recipient, 
            subject: doc.data().subject, 
            rowClassName: 'row',
            attachments: doc.data().attachments,
            date: doc.data().date,
            time: doc.data().time,
            status: `${doc.data().status}`,
            senderId: doc.data().senderId,
            message: `${doc.data().message}`
          });
        });
        retrievedrows.sort((a, b) => a.date.localeCompare(b.date));
        retrievedrows.sort((a, b) => a.time.localeCompare(b.time));
        retrievedrows.sort((a, b) => a.id.localeCompare(b.id));

        const filteredRows = [];

        for (let i = 0; i < retrievedrows.length; i++) {
          if (i === retrievedrows.length - 1) {
            filteredRows.push(retrievedrows[i]);
            break;
          }
  
          if (retrievedrows[i].id !== retrievedrows[i + 1].id) {
            filteredRows.push(retrievedrows[i]);
          }
        }
        
        // Sort the retrieved rows by date and time
        filteredRows.sort((b, a) => {
          // First, compare by date
          const dateComparison = a.date.localeCompare(b.date);
          if (dateComparison !== 0) {
            return dateComparison;
          }
          // If dates are equal, compare by time
          return a.time.localeCompare(b.time);
        });
        
        setRows(filteredRows);
        console.log("Retrieved docs: ", filteredRows);
      });
      console.log("Retrieved docs: ", rows);
      return () => unsubscribe();
    }
  }, [currentUser]);
  
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

      setMessage('Missing information.')
      setTimeout(() => {
        setMessage('')
        setErrors({})
      }, 6000)
      return;
    }
  
    try {
      const uniqueid = uuid()
      const downloadURLs = await uploadFilesToStorage(uniqueid);
      const docData = {
        inquiryid: uniqueid,
        recipient: selectedoption.email,
        subject: subject,
        message: content,
        senderId: currentUser.uid,
        date: Timestamp.now().toDate().toLocaleDateString(),
        time: Timestamp.now().toDate().toLocaleTimeString(),
        lastinteraction: currentUser.uid,
        status: 'Sent',
        attachments: downloadURLs
      };
  
      console.log(docData);
      await setDoc(doc(db, 'inquiries', uniqueid), docData)

      setSelectedOption(prevState => ({
        ...prevState,
        email: '',
        header: '',
        subject: ''
      }));
      setContent('')
      setSubject('')
      setShowState('')
      setFiles([])
      setMessage('Inquiry successfully sent!')

      setTimeout(() => {
        setMessage('')
      }, 6000)
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  
  return (
    <div className={`w-full h-screen flex bg-neutral-100`}>
      <NavbarIconsOnly/>
      <Messagebox params={parameters} isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className='w-full h-full flex flex-col'>
        <div className='flex flex-row w-full h-[45px] py-10 items-center px-2'>
          <div className='ml-[30px]'>
            <button onClick={handlegoback}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] hover:bg-[#883138] text-[#F5F5F5] rounded-full p-2 m-2 '/>
            </button>
            Go back
          </div>
          <div className='flex items-center justify-end ml-auto mr-[30px]'>
            <button onClick={handleRightPanelSwitch}>
              <QuestionAnswerIcon sx={{ fontSize: 35}} className='bg-[#115E59] hover:bg-[#883138] text-[#F5F5F5] rounded-full p-2 m-2 '/>
            </button>
            Inquiries
          </div>
        </div>

        <div className='flex flex-1 w-full'>

          {/*child 1 */}
          <div className='flex h-full flex-col w-full mx-10'>
            <label className='text-2xl font-weight-900 w-full flex justify-center py-4'>INQUIRY FORM</label>
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

            <div className='text-[#115E59] fixed bottom-20 left-1/4 transform -translate-x-1/2'>
              {message}
            </div>

          </div>

          {/*child2*/}
          <div className='px-[30px] flex w-full'>

            {!showInbox &&
              <div className='w-full flex flex-col'>
                <label className='flex justify-center w-full text-2xl font-weight-900 py-4'>CATEGORY</label>
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
            }

            {showInbox &&
              <div className='w-full flex flex-col h-full'>
                <label className='flex justify-center w-full text-2xl font-weight-900 py-4'>INBOX</label>
                <DataGrid
                  rows={rows}
                  onRowClick={rowclickhandler}
                  columns={columns}
                  sx={{
                    '& .header' : {
                      fontWeight: 'bold',
                    },
                    '& .rows' : {
                      '&:hover' : { backgroundColor: '#115E59', color: 'white', cursor: 'pointer'}
                    }
                  }}
                  getRowClassName={(params) => 'rows'}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                  disableRowSelectionOnClick
                />
              </div>
            }

          </div>

        </div>
      </div>
    </div>
  )
}
//
const Messagebox = ({params, isOpen, setIsOpen}) => {
  const customStyles = {
    content: {
      borderRadius: '10px', 
      width: '50%',
      height: '80%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#FFFFFF',
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5)"

    }
  };


  return (
    <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false)} style={customStyles}>
          <Message setIsOpen={setIsOpen} message={params}/>
    </Modal>
  ) 
}


export default Inquiry


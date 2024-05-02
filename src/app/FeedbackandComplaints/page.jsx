'use client'
import React, { useContext, useEffect, useState } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { RiEmotionSadLine } from "react-icons/ri";
import { RiEmotionUnhappyLine } from "react-icons/ri";
import { RiEmotionNormalLine } from "react-icons/ri";
import { RiEmotionLine } from "react-icons/ri";
import { RiEmotionLaughLine } from "react-icons/ri";
import { RiEmotionSadFill } from "react-icons/ri";
import { RiEmotionUnhappyFill } from "react-icons/ri";
import { RiEmotionNormalFill } from "react-icons/ri";
import { RiEmotionFill } from "react-icons/ri";
import { RiEmotionLaughFill } from "react-icons/ri";
import { QuerySnapshot, Timestamp, addDoc, collection, getDocs, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { AuthContext } from '@/context/AuthContext';
import Modal from 'react-modal'
import Message from './Message';

const FeedbackandComplaints = () => {
  const {currentUser} = useContext(AuthContext);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: 'category', headerClassName: 'header', headerName: 'Category', flex: 0.2},
    { field: 'rate', headerClassName: 'header', headerName: 'Rate', flex: 0.1},
    { field: 'feedback', headerClassName: 'header', headerName: 'Feedback', flex: 0.3},
    { field: 'date', headerClassName: 'header', headerName: 'Date', flex: 0.2},
    { field: 'time', headerClassName: 'header', headerName: 'Time', flex: 0.2},
  ]


  useEffect(() => {
    const q = query(collection(db, 'feedback'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const retrievedrows = [];
  
      querySnapshot.forEach((doc) => {
        retrievedrows.push({
          id: doc.id,
          category: doc.data().category,
          date: doc.data().date,
          time: doc.data().time,
          feedback: doc.data().feedback,
          rate: doc.data().rate,
        });
      });
  
      retrievedrows.sort((b, a) => a.date.localeCompare(b.date));
      retrievedrows.sort((b, a) => a.time.localeCompare(b.time));
  
      setRows(retrievedrows);
      console.log(retrievedrows)
    });
    
    return () => unsubscribe();
  }, []);

  const handlegoback = () => {
    window.history.back();
  }

  Modal.setAppElement("body")
  const [isOpen, setIsOpen] = useState(false)
  const [parameters, setParameters] = useState([])
  const rowclickhandler = (params) => {
    const rowdata = params.row;
    setIsOpen(true)
    setParameters(rowdata)
    console.log("Row is clicked. Params.row value: ", rowdata)
  }

  const [rate, setRate] = useState('')
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('General Feedback')
  const [errors, setErrors] = useState({
    rating: '',
    feedback: '',
  })
  const [message, setMessage] = useState('')

  const HandleRateChange = (selectedRate) => {
    setRate(selectedRate);
  }

  const HandleFeedbackInput = (event) => {
    setFeedback(event.target.value)
  }

  const HandleCategoryChange = (category) => {
    setCategory(category);
  }

  const HandleSendFeedback = async () => {
    if (!rate) {
      setMessage("Please provide a rating");
      setTimeout(() => {
        setMessage('')
      }, 6000);
      return
    }
    if (rate <= 3) {
      if(category != 'general feedback' && !feedback){
        setErrors({
          feedback: !feedback ? 'feedback' : '',
        })
        if(category === 'complaint') setMessage('Please provide your complaint in the textbox.');
        if(category === 'bug issue') setMessage('Please provide the bug issue in the textbox');
        if(category === 'suggestion') setMessage('Please provide your suggestion.');

        setTimeout(() => {
          setErrors({})
          setMessage('')
        }, 6000);

        return
      }
    }

    const feedbackinformation = {
      rate: rate,
      feedback: feedback,
      category: category,
      date: Timestamp.now().toDate().toLocaleDateString(),
      time: Timestamp.now().toDate().toLocaleTimeString(),
  }

    await addDoc(collection(db, "feedback"), feedbackinformation)

    setMessage('Feedback sent successfully!');
    setTimeout(() => {
      setMessage('')
    }, 5000);

    setCategory('general feedback')
    setRate('')
    setFeedback('');
  }


  return (
    <div className='w-full h-screen flex bg-neutral-100'>
      <NavbarIconsOnly/>
      <Messagebox params={parameters} isOpen={isOpen} setIsOpen={setIsOpen}/>
      <div className='flex flex-grow px-5 py-5 w-full h-full flex-col'>

        <div className='flex flex-row w-full h-[45px] py-10 items-center'>

          <div className=''>
            <button onClick={handlegoback}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] hover:bg-[#883138] text-[#F5F5F5] rounded-full p-2 mr-2 '/>
            </button>
            Go back
          </div>

        </div>

          <div className='flex flex-1'>
          
            <div className='flex flex-col justify-center w-full'>
              <label className='font-bold text-2xl my-[5px]'>Your feedback is important to us!</label>
              <label className='text-lg'>How is your experience with our application?</label>
              <div className='flex flex-row justify-between my-[20px]'>
                {rate===1 ?
                  <RiEmotionSadFill onClick={() => HandleRateChange(1)} className='text-[#D22D2D] text-[150px]'/> :
                  <RiEmotionSadLine onClick={() => HandleRateChange(1)} className='hover:text-[#D22D2D] text-[150px] cursor-pointer'/>}
                {rate===2 ?
                  <RiEmotionUnhappyFill onClick={() => HandleRateChange(2)} className='text-[#FA8714] text-[150px]'/> :
                  <RiEmotionUnhappyLine onClick={() => HandleRateChange(2)} className='hover:text-[#FA8714] text-[150px] cursor-pointer'/>}
                {rate===3 ?
                  <RiEmotionNormalFill onClick={() => HandleRateChange(3)} className='text-[#FFEB00] text-[150px]'/> :
                  <RiEmotionNormalLine onClick={() => HandleRateChange(3)} className='hover:text-[#FFEB00] text-[150px] cursor-pointer'/>}
                {rate===4 ?
                  <RiEmotionFill onClick={() => HandleRateChange(4)} className='text-[#00CDC8] text-[150px]'/> :
                  <RiEmotionLine onClick={() => HandleRateChange(4)} className='hover:text-[#00CDC8] text-[150px] cursor-pointer'/>}
                {rate===5 ?
                  <RiEmotionLaughFill onClick={() => HandleRateChange(5)} className='text-[#46D750] text-[150px]'/> :
                  <RiEmotionLaughLine onClick={() => HandleRateChange(5)} className='hover:text-[#46D750] text-[150px] cursor-pointer'/>}
              </div>
              <label className='text-lg my-[10px]'>{`Do you have any thoughts you'd like to share?`}</label>
              <textarea className='rounded-[20px] p-[15px] shadow-lg border-2 border-black-100 resize-none my-[10px]' name="feedback" value={feedback} onChange={HandleFeedbackInput} rows="5"/>
              <div className='my-[10px]'>
                <label className='text-lg my-[10px]'>Categorize your feedback so we can get back to you faster!</label>
                <div className='my-[10px]'>
                  <label onClick={() => HandleCategoryChange('General Feedback')} className={`${category==='General Feedback' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>General Feedback</label>
                  <label onClick={() => HandleCategoryChange('Complaint')} className={`${category==='Complaint' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>Complaint</label>
                  <label onClick={() => HandleCategoryChange('Bug Issue')} className={`${category==='Bug Issue' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>Bug Issue</label>
                  <label onClick={() => HandleCategoryChange('Suggestion')} className={`${category==='Suggestion' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>Suggestion</label>
                </div>
              </div>
              <div className='flex justify-end my-[30px]'>
                <div className='flex mr-[15px]'>
                  <button onClick={HandleSendFeedback} className='hover:bg-[#701216] hover:text-white bg-[#00687B] shadow-lg text-2xl text-white w-[150px] h-[75px] rounded-[20px]'>
                    Send
                  </button>
                </div>
              </div>
              <div className='text-[#115E59] text-lg fixed bottom-20 left-1/4 transform -translate-x-1/2'>
              {message}
              </div>
            </div>

            <div className='flex w-full'>
              {currentUser.role === 'admin' && <div className='w-full flex flex-col justify-start h-full'>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  onRowClick={rowclickhandler}
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
              </div>}
            </div>

          </div>

      </div>
    </div>
  )
}

const Messagebox = ({params, isOpen, setIsOpen}) => {
  const customStyles = {
    content: {
      borderRadius: '10px', 
      width: '50%',
      height: 'auto',
      maxHeight: '50%',
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
      <Message setIsOpen={setIsOpen} parameters={params}/>
    </Modal>
  ) 
}

export default FeedbackandComplaints

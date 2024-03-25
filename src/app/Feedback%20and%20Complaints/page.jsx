'use client'
import React, { useState } from 'react'
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
import { Timestamp, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase-config';

const page = () => {
  const handlegoback = () => {
    window.history.back();
  }

  const [rate, setRate] = useState('')
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general feedback')
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
      date: Timestamp.now()
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
      <div className='flex flex-grow px-5 py-5 w-full h-full flex-col'>

        <div className='flex flex-row w-full h-[45px] py-10 items-center px-2'>

          <div className=''>
            <button onClick={handlegoback}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] hover:bg-[#883138] text-[#F5F5F5] rounded-full p-2 m-2 '/>
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
              <label className='text-lg my-[10px]'>Do you have any thoughts you'd like to share?</label>
              <textarea className='rounded-[20px] p-[15px] shadow-lg border-2 border-black-100 resize-none my-[10px]' name="feedback" value={feedback} onChange={HandleFeedbackInput} rows="5"/>
              <div className='my-[10px]'>
                <label className='text-lg my-[10px]'>Categorize your feedback so we can get back to you faster!</label>
                <div className='my-[10px]'>
                  <label onClick={() => HandleCategoryChange('general feedback')} className={`${category==='general feedback' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>General Feedback</label>
                  <label onClick={() => HandleCategoryChange('complaint')} className={`${category==='complaint' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>Complaint</label>
                  <label onClick={() => HandleCategoryChange('bug issue')} className={`${category==='bug issue' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>Bug Issue</label>
                  <label onClick={() => HandleCategoryChange('suggestion')} className={`${category==='suggestion' ? 'bg-[#00687B] text-white' : 'bg-gray-200'} hover:bg-[#701216] hover:text-white rounded-[10px] cursor-pointer p-[5px] mx-[5px]`}>Suggestion</label>
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
              {/*Second half*/}
            </div>

          </div>

      </div>
    </div>
  )
}

export default page

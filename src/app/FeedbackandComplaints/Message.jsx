'use client'

import React from 'react'

const Message = ({setIsOpen, parameters}) => {

    function getFontColor(rate) {
        switch(rate) {
          case 1:
            return '#D22D2D';
          case 2:
            return '#FA8714';
          case 3:
            return '#FFEB00';
          case 4:
            return '#00CDC8';
          case 5:
            return '#46D750';
          default:
            return 'inherit';
        }
      }
      
      function getRatingDescription(rate) {
        switch(rate) {
          case 1:
            return 'Poor';
          case 2:
            return 'Fair';
          case 3:
            return 'Good';
          case 4:
            return 'Very Good';
          case 5:
            return 'Best';
          default:
            return '';
        }
      }
      

  return (
    <div>
        <div className='flex flex-row m-[10px] items-center'>
            <label className='text-xl'>Category: </label>
            <label className='text-xl ml-[10px] font-bold'>{parameters.category}</label>
        </div>

        <div className='flex flex-row m-[10px] items-center'>
            <label className='text-xl'>Date and Time Reported: </label>
            <label className='text-xl ml-[10px] font-bold'>{parameters.date}, {parameters.time}</label>
        </div>

        <div className='flex flex-row m-[10px] items-center'>
            <label className='text-xl'>Rate: </label>
            <label className='text-xl ml-[10px] font-bold' style={{ color: getFontColor(parameters.rate) }}>
                {parameters.rate} - {getRatingDescription(parameters.rate)}
            </label>
        </div>

        <div className='flex flex-col m-[10px]'>
            <label className='text-xl'>Feedback Message: </label>
            <label className='text-xl m-[10px] p-[10px] rounded-[20px] bg-[#E1E1E1]'>{parameters.feedback}</label>
        </div>

        <div className='flex flex-row justify-end mt-auto'>
            <button className='bg-[#115E59] px-[20px] py-[10px] text-white text-lg rounded-[10px]' onClick={() => setIsOpen(false)}>Close</button>
        </div>
    </div>
  )
}

export default Message

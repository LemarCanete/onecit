'use client'
import React from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import MainDashboard from './MainDashboard';

const page = () => {
  const handlegoback = () => {
    window.history.back();
  }

  return (
    <div className='w-full h-screen flex bg-neutral-100'>
      <NavbarIconsOnly/>
      <div className='grow px-10 py-5 overflow-auto'>
        <div className='flex flex-row w-full h-[45px] py-10 items-center'>
          <div className=''>
            <button onClick={handlegoback}>
              <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] hover:bg-[#883138] text-[#F5F5F5] rounded-full p-2 mr-2 '/>
            </button>
            Go back
          </div>
        </div>

        <div className=''>
          <MainDashboard/>
        </div>

      </div>
    </div>
  )
}

export default page

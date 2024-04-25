import React, { useEffect, useState } from 'react'
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import PanoramaFishEyeRoundedIcon from '@mui/icons-material/PanoramaFishEyeRounded';
import Modal from 'react-modal'
import ViewTask from './ViewTask';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase-config';

const TaskComponent = ({ViewSelectedTask, task, id, title, description, duedate, duetime, priority}) => {
    const handleOpenTask = (object) => {
      ViewSelectedTask(object)
    }

    const [data, setData] = useState(null)

    const convertTo12HourFormat = (time24) => {
      // Split the time string into hours and minutes
      const [hours24, minutes] = time24.split(':');
    
      // Convert hours to integer
      let hours = parseInt(hours24, 10);
    
      // Determine if it's AM or PM
      const ampm = hours >= 12 ? 'PM' : 'AM';
    
      // Convert hours from 24-hour to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 should be converted to 12
    
      // Construct the formatted time string
      const formattedTime = hours + ':' + minutes + ' ' + ampm;
    
      return formattedTime;
    };

    const priorityOptions = [
        { label: 'Urgent', value: 'Urgent', specialClass: 'bg-[#B13A41]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#B13A41]' },
        { label: 'High', value: 'High', specialClass: 'bg-[#CF940A]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#CF940A]' },
        { label: 'Normal', value: 'Normal', specialClass: 'bg-[#4466FF]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#4466FF]' },
        { label: 'Low', value: 'Low', specialClass: 'bg-[#87909E]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#87909E]' },
    ];

    const selectedPriority = priorityOptions.find(option => option.value === priority);

    useEffect(() => {
      if (db && id) {
        const unsubscribe = onSnapshot(doc(db, "tasks", id), (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setData(data);
          } else {
            console.log("No such document!");
          }
        });
  
        return () => {
          unsubscribe();
        };
      } else {
        console.error("Database or task ID is undefined.");
      }
    }, [db, id]); // Ensure `id` is defined
  
  useEffect(() => {
    //console.log("Data in TaskComponent.jsx:", data);
  })


  return (
    <div id='task' 
      className='cursor-pointer my-2 flex flex-col justify-center px-4 justify-between py-4 rounded-[10px] bg-white border-2 hover:shadow-md transition-all'
      onClick={() => handleOpenTask(data)}>
        <div className='flex grow'>
            <p className={`${priority === 'Urgent' ? 'text-[#B13A41]' : ''} flex-1 truncate text-xl font-bold`}> {title} </p>
            {selectedPriority && selectedPriority.icon && <FlagRoundedIcon className={`ml-2 ${selectedPriority.iconColor}`} />}
        </div>
        <div className='mt-2'>
            <p className='line-clamp-3 opacity-75 hover:opacity-100'>{description}</p>
        </div>
        <div className='flex mt-4 space-between items-center'>
            {duedate && duetime ?
                <label className='grow '><EventAvailableRoundedIcon/> {duedate}, {duetime} </label> :
            duedate && !duetime ?
                <label className='grow '><EventAvailableRoundedIcon/> {duedate} </label> :
                <label className='grow '> </label>
            }
        </div>
    </div>
  )
}

export default TaskComponent

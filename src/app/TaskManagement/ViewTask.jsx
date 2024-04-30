import { db } from '@/firebase-config'
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import StatusBox from './StatusBox';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import UpdateRoundedIcon from '@mui/icons-material/UpdateRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PanoramaFishEyeRoundedIcon from '@mui/icons-material/PanoramaFishEyeRounded';
import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';


const ViewTask = ({setIsOpen, task}) => {
  //console.log("task value: ",task)
  const [data, setData] = useState(task)
  const [newData, setNewData] = useState(data)
  const [isEditing, setIsEditing] = useState(false)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(task.status)
  const [priority, setPriority] = useState('Low')
  const [prevStatus, setPrevStatus] = useState(null)
  const [prevPriority, setPrevPriority] = useState(null)

  const statusOptions = [
        { label: 'To Do', value: 'To Do', specialClass: 'bg-[#9A9C9E]', icon: <PanoramaFishEyeRoundedIcon/>, iconColor: 'text-[#9A9C9E]' },
        { label: 'In Progress', value: 'In Progress', specialClass: 'bg-[#1090E0]', icon: <AutoModeRoundedIcon/>, iconColor: 'text-[#1090E0]' },
        { label: 'Completed', value: 'Completed', specialClass: 'bg-[#349F6A]', icon: <CheckCircleRoundedIcon/>, iconColor: 'text-[#349F6A]' },
      ];
  const priorityOptions = [
        { label: 'Urgent', value: 'Urgent', specialClass: 'bg-[#B13A41]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#B13A41]' },
        { label: 'High', value: 'High', specialClass: 'bg-[#CF940A]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#CF940A]' },
        { label: 'Normal', value: 'Normal', specialClass: 'bg-[#4466FF]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#4466FF]' },
        { label: 'Low', value: 'Low', specialClass: 'bg-[#87909E]', icon: <FlagRoundedIcon/>, iconColor: 'text-[#87909E]' },
      ];

  const handleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSave = async () => {
    console.log("newData values:", newData)
    // Before saving, validate your data (if needed)
    if (newData.title.trim() === '') {
      setErrors({ title: 'Title cannot be empty' });
      return;
    }

    // Get a reference to the document with the same ID
    const docRef = doc(db, 'tasks', task.id);

    try {
      // Update the Firestore document with the new data
      await updateDoc(docRef, {
        title: newData.title,
        description: newData.description,
        status: newData.status,
        priority: newData.priority,
        duedate: newData.duedate,
        duetime: newData.duetime,
      });

      // If successful, update the local `data` state to match `newData`
      setData(newData);

      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.log('Document retrieved:', newData)
      console.error('Error updating document:', error);
    }
  };


  const handleCancel = () => {
    setIsEditing(false); // Exit edit mode
    setIsOpen(false)
  };
  

  const handleStatusChange = (newStatus) => {
    setNewData((prevData) => ({
      ...prevData, // Keep all existing fields
      status: newStatus, // Update only the status field
    }));
  };
    
  const handleTitleChange = (event) => {
    setNewData((prevData) => ({
      ...prevData,
      title: event.target.value,
    }));
  };

  const handleDescChange = (event) => {
    setNewData((prevData) => ({
      ...prevData,
      description: event.target.value,
    }));
  };



  const handlePriorityChange = (newPriority) => {
    setNewData((prevData) => ({
      ...prevData,
      priority: newPriority,
    }));
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "tasks", task.id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setData(data)
      } else {
        console.log("No such document!");
      }
    });
    return () => {
      unsubscribe();
    };
  }, [task.id]);

  useEffect(() => {
    //console.log("data object in ViewTask:", newData);
  })

  

  return (
    <div className=' flex flex-col p-4'>
      <div className='border-b-2 flex pb-4 items-center justify-end w-full'>
        <CloseRoundedIcon className='opacity-50 hover:opacity-100 cursor-pointer' onClick={() => setIsOpen(false)}/>
      </div>
      <div className="flex flex-col">
          <input 
            className={`${errors['title'] ? 'border-b-2 border-rose-500' : 'border-none'} w-full bg-transparent pt-4 text-2xl outline-none font-bold transition-all`}
            placeholder='Enter Task Name Here...' 
            type="text"
            value={newData.title}
            onChange={handleTitleChange}
            disabled={isEditing===true ? false : true}
          />
          <label 
            className={`absolute bottom-[-25px] right-0 text-red-500 transition-opacity duration-500 ${errors['title'] ? '' : 'opacity-0 duration-500'}`}
          >
            {errors['title'] && 'This field is required.'}
          </label>
      </div>

      <label className='mt-4 text-l font-bold'>Description:</label>
      <textarea 
          placeholder='Add a description...'
          className='resize-none p-2 border-none outline-none bg-transparent'
          rows={'10'}
          value={newData.description}
          onChange={handleDescChange}
          disabled={isEditing===true ? false : true}/>

    <div className='flex flex-row items-center w-full justify-center px-4 mt-2'>
        <div className='flex flex-row'>
          <label className='p-2 font-bold'> Status: </label>
          <StatusBox
            options={statusOptions} 
            initialStatus={data.status} 
            setStatus={handleStatusChange}
            isDisabled={!isEditing} 
            isEditing={isEditing}
          />
        </div>
        <div className='flex flex-row'>
          <label className='p-2 font-bold whitespace-nowrap'> Due Date: </label>
          <input
            className="p-2 mr-2 bg-transparent rounded-[10px] border-2"
            type="date"
            value={newData.duedate}
            min={new Date().toISOString().split("T")[0]} // Set min attribute to today's date
            onChange={(event) => setNewData((prevData) => ({
              ...prevData,
              duedate: event.target.value,
            }))}
            disabled={isEditing? false: true}
          />

          {data.duedate && (
            <input
              className="p-2 mr-2 bg-transparent rounded-[10px] border-2"
              type="time"
              value={newData.duetime}
              min={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} // Set min attribute to current time
              onChange={(event) => setNewData((prevData) => ({
                ...prevData,
                duetime: event.target.value,
              }))}
              disabled={isEditing? false: true}
            />
          )}

        </div>
        <div className='flex flex-row'>
          <label className='p-2 font-bold'> Priority: </label>
          <StatusBox
            options={priorityOptions} 
            setStatus={handlePriorityChange} 
            initialStatus={newData.priority}
            isDisabled={!isEditing} 
            isEditing={isEditing}
          />
        </div>
      </div>

      <div className='flex justify-end mt-4'>
        {isEditing ? <button className='bg-[#115E59] text-white px-4 py-2 rounded-[10px] mr-2' onClick={handleSave}>Save</button> :
                      <button className='bg-[#115E59] text-white px-4 py-2 rounded-[10px] mr-2' onClick={handleEdit}>Edit</button>
        }
        {isEditing ? <button className='bg-[#9A9C9E] text-white px-4 py-2 rounded-[10px] mr-2' onClick={handleCancel}>Cancel</button> :
                      '' }
      </div>
    </div>
  )
}

export default ViewTask

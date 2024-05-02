import React, { useContext, useEffect, useState } from 'react'
import StatusBox from './StatusBox';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import PanoramaFishEyeRoundedIcon from '@mui/icons-material/PanoramaFishEyeRounded';
import AutoModeRoundedIcon from '@mui/icons-material/AutoModeRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { addDoc, setDoc, doc, collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { AuthContext } from '@/context/AuthContext';

const AddTaskForm = ({setIsOpen, initialStatus}) => {
  const {currentUser} = useContext(AuthContext)

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

  const [todo, setTodo] = useState([])
  const [inprogress, setInprogress] = useState([])
  const [completed, setCompleted] = useState([])

  useEffect(() => {

    const q = query(collection(db, 'tasks'), where('uid', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const retrievedTD = [];
      const retrievedIP = [];
      const retrievedCm = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const dataid = doc.id; // Get the document ID using doc.id
        if (data.status === 'To Do') {
          retrievedTD.push({ ...data, id: dataid });
        } else if (data.status === 'In Progress') {
          retrievedIP.push({ ...data, id: dataid });
        } else if (data.status === 'Completed') {
          retrievedCm.push({ ...data, id: dataid });
        }
      });

      setTodo(retrievedTD);
      setInprogress(retrievedIP);
      setCompleted(retrievedCm);
    });

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

      const [title, setTitle] = useState('')

    const handleTitleChange = (event) => {
      setTitle(event.target.value);
    }

      const [description, setDescription] = useState('')

      const handleDescChange = (event) => {
        setDescription(event.target.value);
      }

      const [status, setStatus] = useState(initialStatus)
      const [date, setDate] = useState(null)
      const [time, setTime] = useState(null)
      const [priority, setPriority] = useState('Low')
      const [errors, setErrors] = useState({})

      const handleChangeStatus = (value) => {
        setStatus(value)
      }

      const handleAddTask = async () => {
        const allTasks = [...todo, ...inprogress, ...completed];

        const taskFound = allTasks.some(task => task.title.toLowerCase() === title.toLowerCase());
        console.log(allTasks)
        if (taskFound) {
          console.log("A task with the given title was found in one of the arrays!");
          setErrors({
            title: 'This task already exists!',
          });
          setTimeout(() => {
            setErrors({
              title: '',
              status: '',
              priority: '',
            });
          }, 5000);
          return
        } else {
          console.log("No task with the given title was found in any array.");
        }


        if (!currentUser || !currentUser.uid) {
          console.log("User not logged in. Cannot create task.");
          return;
        }
      
        if (!title || !status || !priority) {
          setErrors({
            title: !title ? 'This field is required.' : '',
            status: !status ? 'description' : '',
            priority: !priority ? 'priority' : ''
          });
      
          setTimeout(() => {
            setErrors({
              title: '',
              status: '',
              priority: '',
            });
          }, 5000);
          return;
        }
      
        try {
          // Step 1: Create a new document reference to generate an ID
          const docRef = doc(collection(db, "tasks")); // Generates a new document ID
      
          // Step 2: Create the task object, including the generated ID
          const task = {
            id: docRef.id, // Store the generated ID in the task object
            title: title,
            description: description,
            status: status,
            duedate: date || '',
            duetime: time || '',
            priority: priority,
            uid: currentUser.uid
          };
      
          // Step 3: Set the document with the created reference
          await setDoc(docRef, task); // Set the document with data including its ID
      
          console.log("Successfully added document:", task);
      
          setTimeout(() => {
            setTitle('');
            setDescription('');
            setIsOpen(false);
          }, 2000);
      
        } catch (error) {
          console.error("Error adding document:", error);
        }
      };
      


  return (
    <div className='flex flex-col'>
      <div className='border-b-2 flex pb-4 items-center justify-end w-full'>
        <CloseRoundedIcon className='opacity-50 hover:opacity-100 cursor-pointer' onClick={() => setIsOpen(false)}/>
      </div>
      <div className='relative'>
        <div className="flex flex-col">
          <input 
            className={`${errors['title'] ? 'border-b-2 border-rose-500' : 'border-none'} w-full bg-transparent pt-4 text-2xl outline-none font-bold transition-all`}
            placeholder='Enter Task Name Here...' 
            type="text"
            value={title}
            onChange={handleTitleChange}
          />
          <label 
            className={`absolute bottom-[-25px] right-0 text-red-500 transition-opacity duration-500 ${errors['title'] ? '' : 'opacity-0 duration-500'}`}
          >
            {errors['title'] && errors.title}
          </label>
        </div>
      </div>

        <label className='mt-4 text-l font-bold'>Description:</label>
        <textarea 
            placeholder='Add a description...'
            className='resize-none p-2 border-none outline-none bg-transparent'
            rows={'10'}
            value={description}
            onChange={handleDescChange}/>
        <div className='flex flex-row items-center w-full justify-center px-4 mt-2'>
            <div className='flex flex-row'>
              <label className='p-2 font-bold'> Status: </label>
              <StatusBox options={statusOptions} initialStatus={initialStatus} setStatus={handleChangeStatus} isDisabled={false} isEditing={true}/>
            </div>
            <div className='flex flex-row'>
              <label className='p-2 font-bold whitespace-nowrap'> Due Date: </label>
              <input
                className="p-2 mr-2 bg-transparent rounded-[10px] border-2"
                type="date"
                min={new Date().toISOString().split("T")[0]} // Set min attribute to today's date
                onChange={(event) => setDate(event.target.value)}
              />

              {date && (
                <input
                  className="p-2 mr-2 bg-transparent rounded-[10px] border-2"
                  type="time"
                  min={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} // Set min attribute to current time
                  onChange={(event) => setTime(event.target.value)}
                />
              )}

            </div>
            <div className='flex flex-row'>
              <label className='p-2 font-bold'> Priority: </label>
              <StatusBox options={priorityOptions} setStatus={setPriority} initialStatus={'Low'}/>
            </div>
        </div>
        <div className='w-full flex justify-end pt-4'>
          <button className='bg-[#115E59] text-white hover:bg-[#701216] text-xl py-2 px-2 rounded-[10px] items-center hover:shadow-lg transition-all'
            onClick={handleAddTask}>
            <AddBoxRoundedIcon/> Create task
          </button>
        </div>
    </div>
  )
}

export default AddTaskForm

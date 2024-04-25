import React, { useContext, useEffect, useState } from 'react'
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import PanoramaFishEyeRoundedIcon from '@mui/icons-material/PanoramaFishEyeRounded';
import Modal from 'react-modal'
import AddTaskForm from './AddTaskForm';
import TaskComponent from './TaskComponent';
import { db } from '@/firebase-config';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { AuthContext } from '@/context/AuthContext';
import './CustomScrollbar.css'
import ViewTask from './ViewTask';

const MainDashboard = () => {
    const {currentUser} = useContext(AuthContext)
    Modal.setAppElement("body")
    const [board, setBoard] = useState('list')
    const [ANTisOpen, setANTIsOpen] = useState(false);
    const [VTisOpen, setVTIsOpen] = useState(false);
    const [initialStatus, setInitialStatus] = useState('')
    const [todo, setTodo] = useState([])
    const [inprogress, setInprogress] = useState([])
    const [completed, setCompleted] = useState([])
    const [selectedTask, setSelectedTask] = useState({})


    const AddNewTask = (status) => {
      setANTIsOpen(true)
      setInitialStatus(status)
    }

    const ViewSelectedTask = (task) => {
      setVTIsOpen(true)
      setSelectedTask(task)
    }

    const sortByDueDateAndTime = (a, b) => {
      if (a.duedate && b.duedate) {
        const dateComparison = a.duedate.localeCompare(b.duedate);
        if (dateComparison !== 0) {
          return dateComparison;
        }
      } else if (a.duedate && !b.duedate) {
        return -1; // 'a' comes first if it has a duedate
      } else if (!a.duedate && b.duedate) {
        return 1; // 'b' comes first if it has duedate
      }
  
      if (a.duetime && b.duetime) {
        return a.duetime.localeCompare(b.duetime);
      } else if (a.duetime && !b.duetime) {
        return -1; // 'a' comes first if it has duetime
      } else if (!a.duetime && b.duetime) {
        return 1; // 'b' comes first if it has duetime
      }
  
      return 0;
    };
  
    const sortByPriority = (a, b) => {
      const priorityOrder = ['Urgent', 'High', 'Normal', 'Low'];
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    };
  

    useEffect(() => {
      if (!currentUser || !currentUser.uid) {
        console.log('User not logged in.');
        return;
      }
  
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
  
        // Sort by due date/time first
        retrievedTD.sort(sortByDueDateAndTime);
        retrievedIP.sort(sortByDueDateAndTime);
        retrievedCm.sort(sortByDueDateAndTime);
  
        // Now sort by priority
        retrievedTD.sort(sortByPriority);
        retrievedIP.sort(sortByPriority);
        retrievedCm.sort(sortByPriority);
  
        setTodo(retrievedTD);
        setInprogress(retrievedIP);
        setCompleted(retrievedCm);
      });
  
      return () => {
        unsubscribe();
      };
    }, [currentUser]);
  
    
    

    useEffect(() => {
      console.log("To do list: ", todo);
      console.log("In Progress list: ", inprogress);
      console.log("Completed list: ", completed);
    }, [todo, inprogress, completed]);

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

  return (
    <div className=''>
      <ViewTaskComponent isOpen={VTisOpen} setIsOpen={setVTIsOpen} task={selectedTask}/>
      <AddTask isOpen={ANTisOpen} setIsOpen={setANTIsOpen} initialStatus={initialStatus}/>
      <div className='w-full bg-white py-2 px-4 rounded-[10px] border-2 hidden'>
        <button className={`${board==='list' ? 'text-[#115E59] font-bold p-2 rounded-[10px]' : 'p-2'} text-l mr-6`} onClick={() => setBoard('list')}> <ChecklistRoundedIcon/> List</button>
        <button className={`${board==='board' ? 'text-[#115E59] font-bold p-2 rounded-[10px]' : 'p-2'} text-l mr-6`} onClick={() => setBoard('board')}> <DashboardRoundedIcon/> Board</button>
      </div>
      
      <div className='w-full h-full flex flex-row py-2 my-2'>

        <div className='w-1/4 px-2'>
            <div className='flex flex-row items-center  px-4 justify-between py-4 rounded-[10px] bg-white border-2'>
                <label className='text-xl font-bold mr-auto'>To Do:</label>
                <AddCircleOutlineRoundedIcon className='cursor-pointer hover:text-[#115E59] transition-all' onClick={() => AddNewTask("To Do")}/>
                
            </div>

            <div className='h-[40rem] overflow-y-scroll tasks-scrollbar my-2 pr-2'>
                {todo.map((task, index) => (
                  <TaskComponent
                    key={index}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    duedate={task.duedate}
                    duetime={task.duetime && convertTo12HourFormat(task.duetime)}
                    priority={task.priority}
                    ViewSelectedTask={ViewSelectedTask}
                  />
                ))}
            </div>
        </div>

        <div className='w-1/4 px-2'>
            <div className='flex flex-row items-center  px-4 justify-between py-4 rounded-[10px] bg-white border-2'>
                <label className='text-xl font-bold mr-auto'>In Progress:</label>
                <AddCircleOutlineRoundedIcon className='cursor-pointer hover:text-[#115E59] transition-all' onClick={() => AddNewTask("In Progress")}/>
            </div>
            <div className='h-[40rem] overflow-y-scroll tasks-scrollbar my-2 pr-2'>
              {inprogress.map((task, index) => (
                <TaskComponent
                  key={index}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  duedate={task.duedate}
                  duetime={task.duetime && convertTo12HourFormat(task.duetime)}
                  priority={task.priority}
                  ViewSelectedTask={ViewSelectedTask}
                />
              ))}
            </div>
            
        </div>

        <div className='w-1/4 px-2'>
            <div className='flex flex-row items-center  px-4 justify-between py-4 rounded-[10px] bg-white border-2'>
                <label className='text-xl font-bold mr-auto'>Completed:</label>
                <AddCircleOutlineRoundedIcon className='cursor-pointer hover:text-[#115E59] transition-all' onClick={() => AddNewTask("Completed")}/>
            </div>
            <div className='h-[40rem] overflow-y-scroll tasks-scrollbar my-2 pr-2'>
              {completed.map((task, index) => (
                <TaskComponent
                  key={index}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  duedate={task.duedate}
                  duetime={task.duetime && convertTo12HourFormat(task.duetime)}
                  priority={task.priority}
                  ViewSelectedTask={ViewSelectedTask}
                />
              ))}
            </div>
        </div>

      </div>
    </div>
  )
}

const AddTask = ({params, isOpen, setIsOpen, initialStatus}) => {
  const customStyles = {
    content: {
      borderRadius: '10px', 
      width: '60%',
      maxWidth: '80%',
      maxHeight: '80%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#F5F5F5',
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5)"

    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false)} style={customStyles}>
          <AddTaskForm setIsOpen={setIsOpen} initialStatus={initialStatus}/>
    </Modal>
  ) 
}

const ViewTaskComponent = ({ isOpen, setIsOpen, task, id }) => {
  const customStyles = {
    content: {
      borderRadius: '10px',
      width: '60%',
      maxWidth: '80%',
      maxHeight: '80%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#F5F5F5',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} onRequestClose={() => setIsOpen(false)} style={customStyles}>
      <ViewTask setIsOpen={setIsOpen} task={task} id={id}/>
    </Modal>
  );
};


export default MainDashboard

import React, { useState, useEffect, useContext } from 'react'
import { BsPlusCircle, BsTrash, BsX } from 'react-icons/bs';
import Datepicker from "react-tailwindcss-datepicker"; 
import { db } from '@/firebase-config';
import { addDoc, collection, deleteDoc, getDocs, query, where,  } from 'firebase/firestore';


const EventForm = ({selectedDate, setIsOpen, dateText, currentUser, events, setEvents}) => {
    const nd = new Date(dateText);
    const splitDateText = `${nd.getFullYear()}-${(nd.getMonth() + 1).toString().padStart(2, '0')}-${nd.getDate().toString().padStart(2, '0')}`;
    const [allDay, setAllDay] = useState(true)  
    const [subTasks, setSubTasks] = useState([]);
    const [mainEvents, setMainEvents] = useState([]);
    const [startTime, setStartTime] = useState(null)
    const [endTime, setEndTime] = useState(null)
    const [subTitle, setSubTitle] = useState("");

    const [value, setValue] = useState({
        startDate: splitDateText,
        endDate: splitDateText
    });
    const [mainTitle, setMainTitle] = useState("");
    const [status, setStatus] = useState("")

    const handleValueChange = newValue => {
        console.log("newValue:", newValue);
        setValue({
            startDate: splitDateText,
            endDate: newValue.endDate
        });

    };

    useEffect(() => {
        const checkEventDate = () => {
            const filteredMainEvents = [];
            const filteredSubEvents = [];
        
            events.forEach(event => {
                const eventStartDate = new Date(event.start);
                const eventEndDate = new Date(event.end);
                const checkDate = new Date(dateText);
        
                // Extract the date part from the event start and end dates
                const eventStartDateOnly = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
                const eventEndDateOnly = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
                const checkDateOnly = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());
        
                // Rule for Main Event: If it has allDay field
                if (event.allDay && checkDateOnly.getTime() >= eventStartDateOnly.getTime() && checkDateOnly.getTime() < eventEndDateOnly.getTime()) {
                    filteredMainEvents.push(event);
                } else {
                    // Rule for Sub Event: If the dateText is the same as the startDate and endDate
                    if (checkDateOnly.getTime() === eventStartDateOnly.getTime() && checkDateOnly.getTime() === eventEndDateOnly.getTime()) {
                        filteredSubEvents.push(event);
                    }
                }
            });
        
            setMainEvents(filteredMainEvents);
            setSubTasks(filteredSubEvents);
        };
    
        if (events) {
            checkEventDate();
        }
    }, [dateText, events]);
    

    const handleMain = async() =>{
        if(mainTitle === "") return;

        try{
            const user = currentUser.uid;
            const role = currentUser.role
            const addMainEvent = await addDoc(collection(db, "calendarEvents"),
                {value, title: mainTitle, user,allDay, role }
            )

            setStatus("Successfully Added!")
        }catch(err){
            console.log(err.message);
            setStatus("Something went wrong!")
        }
    }

    const handleSub = async() =>{
        if(subTitle === "" || startTime === null || endTime === null) return;

        try{
            const role = currentUser.role
            const user = currentUser.uid;
            const addSubEvent = await addDoc(collection(db, "calendarEvents"),
                {value: {startDate: `${dateText}T${startTime}`, endDate: `${dateText}T${endTime}`}, title: subTitle, user, role}
            )
            setStatus("Successfully Added!")
        }catch(err){
            console.log(err.message);
            setStatus("Something went wrong!")
        }
    }

    const handleDeleteEvent = async (task) => {
        const { title, start, end, allDay: wholeDay } = task;
        
        try {
            let q;
            if(!wholeDay){
                q = query(
                    collection(db, 'calendarEvents'),
                    where('title', '==', title),
                    where('value.startDate', '==', start.toString()),
                    where('value.endDate', '==', end.toString()),
                );
            }else{
                q = query(
                    collection(db, 'calendarEvents'),
                    where('title', '==', title),
                    where('value.startDate', '==', start.toString().split('T')[0]),
                    where('value.endDate', '==', end.toString().split('T')[0]),
                );
            }
            
            const querySnapshot = await getDocs(q);
            
            console.log("Number of documents found:", querySnapshot.size);

            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                alert("Successfully Deleted!");
            });
    
        } catch (err) {
            alert("Something went Wrong!");
            console.error("Error deleting document: ", err);
        }
    };


    return (
        <div className="z-20 text-sm flex flex-col content-between justify-between h-full">
            <div className="flex flex-col relative">
                <h1 className="">{selectedDate}</h1>
                <p className="absolute right-0 text-2xl cursor-pointer hover:text-teal-500" onClick={()=>setIsOpen(false)}><BsX /></p>
                <h2 className="font-bold text-center text-lg">Events Details</h2>
                <div className="relative grow ">
                    <div className="my-2" >
                        <p className="font-bold text-base">Main Event</p>
                        <ul className="">
                            {mainEvents.length > 0 ? mainEvents.map((task, i)=>{
                                // Convert start and end times to Date objects
                                const startDate = new Date(task.start);
                                const endDate = new Date(task.end);
                                console.log(task)
                                // Subtract one day from the end date
                                endDate.setDate(endDate.getDate() - 1);

                                // Format start and end dates
                                const formattedStartDate = `${startDate.toLocaleString('default', { month: 'short' })} ${startDate.getDate()}, ${startDate.getFullYear()}`;
                                const formattedEndDate = `${endDate.toLocaleString('default', { month: 'short' })} ${endDate.getDate()}, ${endDate.getFullYear()}`;

                                // Construct the date range string
                                const dateRange = `${task.title} ${formattedStartDate} - ${formattedEndDate}`;

                                return (
                                    <li className='list-decimal list-inside flex gap-3' key={i}>
                                        {dateRange}
                                        {currentUser.uid === task.user && <span className="inline hover:text-teal-500 cursor-pointer text-2xl" onClick={()=>handleDeleteEvent(task)}><BsX /></span>}
                                    </li>
                                );
                            }): <span className='text-black/25 italic flex justify-center items-center h-72 text-2xl'>No event yet!</span> }
                        </ul>
                    </div>


                    
                    <div className="my-2" >
                        <p className="font-bold text-base">Today's Event</p>
                        <ul className="">
                            {subTasks.length > 0 ? subTasks.map((task, i)=>{
                                const startTime = new Date(task.start);
                                const endTime = new Date(task.end);

                                const formattedStartTime = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
                                const formattedEndTime = endTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

                                const timeRange = `${formattedStartTime} - ${formattedEndTime}`;

                                return (
                                    <li className='list-disc list-inside flex gap-3' key={i}>{task.title}
                                        <span className="">{timeRange}</span>
                                        {currentUser.uid === task.user && <span className="inline hover:text-teal-500 cursor-pointer text-2xl" onClick={()=>handleDeleteEvent(task)}><BsX /></span>}
                                    </li>
                                );
                            }): <li className='text-black/25 italic list-disc list-inside'>No event yet!</li> }
                        </ul>
                    </div>

                </div>
            </div>
            
            {/* Event */}
            <div className="">
                <hr className='mb-4'/>
                <h1 className="text-lg font-bold text-center my-4">Add an Event</h1>
                <div className='grid grid-cols-2 gap-3 '>
                    <form className="">
                        <h2 className="font-bold text-center text-base">Main Event</h2>

                        <div className="gap-2 mb-2">
                            <label htmlFor="title" className=''>Title: </label>
                            <input type="text" id='title' className="outline-none border-b w-full" onChange={(e)=>setMainTitle(e.target.value)}/>
                        </div>
                        <label htmlFor="date">Date: </label>
                        <Datepicker 
                            toggleClassName="absolute bg-blue-300 rounded-r-lg text-white right-0 h-full px-3 text-gray-400 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed" 
                            value={value} 
                            onChange={handleValueChange}
                            classNames="absolute z-50"
                            inputId='date'
                            primaryColor={"teal"}

                        /> 
                        <button className="bg-teal-500 py-1 rounded-lg float-right mt-10 text-white flex gap-3 px-3 align-center" type='button' onClick={handleMain}>
                            <span className="">Add</span> 
                            <BsPlusCircle className=''/>
                        </button>
                        <span className={`absolute bottom-0 mb-8 ${(status === 'Successfully Added!') ? 'text-teal-500' : 'text-red-500'}`}>{status}</span>
                    </form>
                    <form className='border-s ps-3 '>
                        <h2 className="font-bold text-center text-base">Today's Event</h2>
                        
                        <div className="flex flex-col mb-2">
                            <label htmlFor="taskTitle">Task Title: </label>
                            <input type="text" id='taskTitle' className='outline-none w-full border-b' onChange={e=>setSubTitle(e.target.value) }/>
                        </div>
                        <div className="flex justify-around">
                            <div className="flex flex-col gap-2 mb-2 ">
                                <label htmlFor="day">Day: </label>
                                <input type="number" id='day' className='p-1 border-b outline-none w-16' value={`${parseInt(dateText.split('-')[2])}`}/>
                            </div>
                            <div className="flex flex-col gap-2 mb-2">
                                <label htmlFor="startTime">Start Time: </label>
                                <input type="time" id='startTime' className='p-1 border-b outline-none' onChange={e=>setStartTime(e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-2 mb-2">
                                <label htmlFor="endTime">End Time: </label>
                                <input type="time" id='endTime' className='p-1 border-b outline-none' onChange={e=>setEndTime(e.target.value)}/>
                            </div>
                        </div>

                        <button className="bg-teal-500 py-1 rounded-lg float-right mt-10 text-white flex gap-3 px-3 align-center" type='button' onClick={handleSub}>
                            <span className="">Add</span> 
                            <BsPlusCircle className=''/>
                        </button>
                    </form>
                    
                </div>
            </div>
        </div>
    )
}

export default EventForm
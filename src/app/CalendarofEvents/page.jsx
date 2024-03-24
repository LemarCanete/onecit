'use client'
import React, { useContext, useEffect, useState } from 'react'
import NavbarIconsOnly from '@/components/NavbarIconsOnly'
import dayGridPlugin from '@fullcalendar/daygrid'
import momentTimezonePlugin from '@fullcalendar/moment-timezone'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import multiMonthPlugin from '@fullcalendar/multimonth'
import listPlugin  from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from 'react-modal';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import EventForm from './EventForm'
import { useRouter } from 'next/navigation'

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '@/firebase-config'
import { AuthContext } from '@/context/AuthContext';

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '750px',
      height: '750px'
    },
    overlay:{
      backgroundColor: "rgba(0, 0, 0, 0.5"

    }
};

Modal.setAppElement("body")


const page = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [dateText, setDateText] = useState(null);
    const {currentUser} = useContext(AuthContext)

    const router = useRouter()

    const [events, setEvents] = useState([
        { title: 'My day', start: '2024-03-25', end: '2024-03-27', allDay: true },
        { title: 'Lunch', start: '2024-03-25T12:00:00', end: '2024-03-25T13:00:00'},
        { title: 'Play', start: '2024-03-25T14:00:00', end: '2024-03-25T18:00:00'},
    ])

    useEffect(() => {
        const fetchData = async () => {
            const fetchedEvents = [];
            const user = currentUser.uid;
    
            const e = await getDocs(query(collection(db, "calendarEvents"), where("user", "==", user)));
    
            e.forEach((doc) => {
                const eventData = doc.data();
    
                const startDate = eventData.value.startDate.includes('T')
                    ? eventData.value.startDate
                    : `${eventData.value.startDate}T00:00:00`; 
    
                const endDate = eventData.value.endDate.includes('T')
                    ? eventData.value.endDate
                    : new Date(
                        new Date(eventData.value.endDate.split('-').map(v => parseInt(v, 10))).getTime() +
                        (1000 * 60 * 60 * 24)
                    ).toISOString();
    
                fetchedEvents.push({
                    title: eventData.title,
                    start: startDate,
                    end: endDate,
                    allDay: eventData.allDay
                });
            });
    
            setEvents(fetchedEvents);
        };
    
        if (currentUser.uid) {
            fetchData();
        }
    }, [currentUser, events]);
    
    console.log(events)
    return (
        <div className='w-full h-screen flex bg-neutral-100 overflow-hidden'>
            <NavbarIconsOnly />
            <div className='grow px-10 py-5 overflow-y-scroll'>
                <div className="flex gap-5 align-center">
                    <button onClick={()=>router.back()}>
                        <ArrowBackIosNewRoundedIcon sx={{ fontSize: 35}} className='bg-[#115E59] text-[#F5F5F5] rounded-full p-2 m-2 '/>Go back
                    </button>
                    <h1 className="text-2xl">Calendar of Events</h1>
                </div>
                
                {/* Calendar */}
                <div className="z-10">
                {currentUser && <FullCalendar 
                        plugins={[dayGridPlugin, timeGridPlugin, multiMonthPlugin, listPlugin, interactionPlugin, momentTimezonePlugin ]}
                        initialView='dayGridMonth'
                        timeZone='local'
                        selectable={true}
                        headerToolbar={{
                            left: 'prev,next',
                            center: 'title',
                            right: 'timeGridDay,timeGridWeek,dayGridMonth,multiMonthYear listMonth'
                        }}
                        weekends={true}
                        events={events}
                        eventContent={renderEventContent}
                        editable={true}
                        viewClassNames="cursor-pointer bg-white/75 text-sm z-0"
                        dayCellClassNames="hover:bg-white"
                        eventClassNames="text-center border-0"
                        dayHeaderClassNames="bg-yellow-500"
                        eventInteractive={true}
                        eventTimeFormat={{hour: 'numeric', minute: '2-digit', timeZoneName: 'short'}}
                        dateClick={(info)=>
                            {
                                const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                const yearNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                                
                                const date = info.date;
                                const formattedDate = `${dayNames[date.getDay()]} - ${yearNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
                                setSelectedDate(formattedDate)
                                setDateText(info.dateStr)
                                setIsOpen(true)
                            }
                        }
                    />}
                </div>

                <Modal isOpen={isOpen} onRequestClose={()=>setIsOpen(false) } style={customStyles}>
                    <EventForm selectedDate={selectedDate} setIsOpen={setIsOpen} 
                        dateText={dateText} currentUser={currentUser}
                        events={events}
                        setEvents={setEvents}/>
                </Modal>

            </div>
        </div>
    )
}
function renderEventContent(eventInfo) {
    const timeText = eventInfo.timeText === ""    
    console.log(eventInfo.timeText, timeText)
    return (
      <div className='text-center w-full'>
        {eventInfo.timeText && <b>{eventInfo.timeText} - </b>}
        <i className={`${timeText} ? '' : 'font-bold' `}>{eventInfo.event.title}</i>
      </div>
    )
}


export default page

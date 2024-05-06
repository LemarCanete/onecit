'use client'

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import React, { useState } from 'react';

const AddClassForm = ({ onSubmit, onCancel }) => {
    const [classNumber, setClassNumber] = useState('');
    const [className, setClassName] = useState('');
    const [location, setLocation] = useState('');
    const [instructor, setInstructor] = useState('');
    const [startHour, setStartHour] = useState('12');
    const [startMinute, setStartMinute] = useState('00');
    const [startPeriod, setStartPeriod] = useState('AM');
    const [endHour, setEndHour] = useState('12');
    const [endMinute, setEndMinute] = useState('00');
    const [endPeriod, setEndPeriod] = useState('AM');
    const [day, setDay] = useState('Monday');
    const {currentUser} = useContext(AuthContext)

    const handleSubmit = (e) => {
        e.preventDefault();
        const classTitle = `${classNumber} ${className}`;
        const startTime = `${startHour}:${startMinute} ${startPeriod}`;
        const endTime = `${endHour}:${endMinute} ${endPeriod}`;
        const newClass = {
            className: classTitle,
            location: location,
            instructor: instructor,
            schedule: `${day}, ${startTime} - ${endTime}`,
            id: currentUser.uid
        };
        onSubmit(newClass);
        setClassNumber('');
        setClassName('');
        setLocation('');
        setInstructor('');
        setStartHour('12');
        setStartMinute('00');
        setStartPeriod('AM');
        setEndHour('12');
        setEndMinute('00');
        setEndPeriod('AM');
        setDay('Monday');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Add Class</h2>
            <div className="mb-4">
                <label htmlFor="classNumber" className="block text-sm font-medium text-gray-700">Class Number</label>
                <input 
                    type="text" 
                    id="classNumber" 
                    value={classNumber} 
                    onChange={(e) => setClassNumber(e.target.value)} 
                    placeholder="Enter class number" 
                    required 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class Name</label>
                <input 
                    type="text" 
                    id="className" 
                    value={className} 
                    onChange={(e) => setClassName(e.target.value)} 
                    placeholder="Enter class name" 
                    required 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                <input 
                    type="text" 
                    id="location" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Enter location" 
                    required 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">Instructor</label>
                <input 
                    type="text" 
                    id="instructor" 
                    value={instructor} 
                    onChange={(e) => setInstructor(e.target.value)} 
                    placeholder="Enter instructor" 
                    required 
                    className="w-full mt-1 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule</label>
                <div className="flex items-center">
                    <select 
                        value={startHour} 
                        onChange={(e) => setStartHour(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        {[...Array(12).keys()].map((hour) => (
                            <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                        ))}
                    </select>
                    <span className="mr-2">:</span>
                    <select 
                        value={startMinute} 
                        onChange={(e) => setStartMinute(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        {[...Array(60).keys()].map((min) => (
                            <option key={min} value={min < 10 ? `0${min}` : min}>{min < 10 ? `0${min}` : min}</option>
                        ))}
                    </select>
                    <select 
                        value={startPeriod} 
                        onChange={(e) => setStartPeriod(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                    <span>-</span>
                    <select 
                        value={endHour} 
                        onChange={(e) => setEndHour(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        {[...Array(12).keys()].map((hour) => (
                            <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                        ))}
                    </select>
                    <span className="mr-2">:</span>
                    <select 
                        value={endMinute} 
                        onChange={(e) => setEndMinute(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        {[...Array(60).keys()].map((min) => (
                            <option key={min} value={min < 10 ? `0${min}` : min}>{min < 10 ? `0${min}` : min}</option>
                        ))}
                    </select>
                    <select 
                        value={endPeriod} 
                        onChange={(e) => setEndPeriod(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="day" className="block text-sm font-medium text-gray-700">Day of the Week</label>
                <select 
                    value={day} 
                    onChange={(e) => setDay(e.target.value)} 
                    className="p-2 border rounded focus:outline-none focus:border-blue-500"
                >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>
            </div>
            <div className="flex justify-end">
                <button 
                    type="submit" 
                    className="bg-blue-500 text-white py-2 px-4 rounded focus:outline-none hover:bg-blue-600"
                >
                    Submit
                </button>
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="ml-2 bg-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none hover:bg-gray-400"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddClassForm;
'use client'
import React, { useState } from 'react';

const AddClassForm = ({ onSubmit, onCancel }) => {
    const [classNumber, setClassNumber] = useState('');
    const [className, setClassName] = useState('');
    const [location, setLocation] = useState('');
    const [instructor, setInstructor] = useState('');
    const [hour, setHour] = useState('12');
    const [minute, setMinute] = useState('00');
    const [period, setPeriod] = useState('AM');

    const handleSubmit = (e) => {
        e.preventDefault();
        const classTitle = `${classNumber} ${className}`;
        const time = `${hour}:${minute} ${period}`;
        const newClass = {
            className: classTitle,
            location: location,
            instructor: instructor,
            schedule: time
        };
        onSubmit(newClass);
        setClassNumber('');
        setClassName('');
        setLocation('');
        setInstructor('');
        setHour('12');
        setMinute('00');
        setPeriod('AM');
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
                        value={hour} 
                        onChange={(e) => setHour(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        {[...Array(12).keys()].map((hour) => (
                            <option key={hour + 1} value={hour + 1}>{hour + 1}</option>
                        ))}
                    </select>
                    <span className="mr-2">:</span>
                    <select 
                        value={minute} 
                        onChange={(e) => setMinute(e.target.value)} 
                        className="mr-2 p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        {[...Array(60).keys()].map((min) => (
                            <option key={min} value={min < 10 ? `0${min}` : min}>{min < 10 ? `0${min}` : min}</option>
                        ))}
                    </select>
                    <select 
                        value={period} 
                        onChange={(e) => setPeriod(e.target.value)} 
                        className="p-2 border rounded focus:outline-none focus:border-blue-500"
                    >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
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
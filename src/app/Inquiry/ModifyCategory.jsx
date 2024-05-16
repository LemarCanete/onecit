import React from 'react'
import { useState } from 'react'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase-config';
import { v4 as uuidv4 } from 'uuid';

const ModifyCategory = ({ setIsOpen, category }) => {
    const [header, setHeader] = useState(category.header)
    const [email, setEmail] = useState(category.email)
    const [options, setOptions] = useState(category.options)

    const handleHeaderChange = (event) => {
        setHeader(event.target.value)
    }
    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    }
    const handleOptionLabelChange = (event, index) => {
        const newOptions = [...options]; // Make a copy of the options array
        newOptions[index] = { ...newOptions[index], label: event.target.value }; // Update the specific option's label
        setOptions(newOptions); // Set the new options array to the state
    };
    const handleOptionValueChange = (event, index) => {
        const newOptions = [...options]; // Make a copy of the options array
        newOptions[index] = { ...newOptions[index], value: event.target.value }; // Update the specific option's value
        setOptions(newOptions); // Set the new options array to the state
    };
    const handleRemoveOption = (index) => {
        const newOptions = options.filter((_, i) => i !== index); // Filter out the option at the specified index
        setOptions(newOptions); // Set the new options array to the state
    };
    const handleAddOption = () => {
        const newOptions = [...options, { label: '', value: '' }]; // Add a new option object
        setOptions(newOptions); // Set the new options array to the state
    };
    const handleUpdate = async () => {
        try {
            const categoryRef = doc(db, 'inquirySettings', category.id); // Adjust 'categories' to your Firestore collection name
            await updateDoc(categoryRef, {
                header,
                email,
                options
            });
            console.log('Document successfully updated');
        } catch (error) {
            console.error('Error updating document: ', error);
        }
    };
    const handleRegisterAsNew = async () => {
        try {
            const newId = uuidv4();
            const newCategoryRef = doc(db, 'inquirySettings', newId);
            const newCategory = { id: newId, header, email, options };
            await setDoc(newCategoryRef, newCategory);
            console.log('New document successfully created with ID: ', newId);
        } catch (error) {
            console.error('Error creating new document: ', error);
        }
    };
    const handleDelete = async () => {
        try {
            const categoryRef = doc(db, 'inquirySettings', category.id);
            await deleteDoc(categoryRef);
            console.log('Document successfully deleted');
            setIsOpen(false); // Close the modal or component after deletion
        } catch (error) {
            console.error('Error deleting document: ', error);
        }
    };

    return (
        <div className='text-xl'>
            <div className=''>
                <div className='flex whitespace-nowrap mb-4'>
                    <label className='font-bold'>Department Name:</label>
                    <input
                        value={header}
                        onChange={handleHeaderChange}
                        className='bg-[#E1E1E1] rounded-[10px] px-2 w-full ml-4'
                    />
                </div>

                <div className='flex whitespace-nowrap mb-4'>
                    <label className='font-bold'>Email:</label>
                    <input
                        value={email}
                        onChange={handleEmailChange}
                        className='bg-[#E1E1E1] rounded-[10px] px-2 w-full ml-4'
                    />
                </div>

                <div className='flex flex-col w-full'>
                    <label className='mb-4 font-bold'>Options/Concerns:</label>
                    {options.map((data, index) => (
                        <div key={index} className='ml-12 flex justify-center'>
                            <label className='font-bold'>Label: </label>
                            <input
                                value={data.label}
                                onChange={(event) => handleOptionLabelChange(event, index)}
                                className='bg-[#E1E1E1] rounded-[10px] px-2 grow ml-2 mb-2'
                            />
                            <label className='font-bold ml-4'>Value: </label>
                            <input
                                value={data.value}
                                onChange={(event) => handleOptionValueChange(event, index)}
                                className='bg-[#E1E1E1] rounded-[10px] px-2 grow ml-2 mb-2'
                            />
                            <RemoveCircleIcon
                                className='ml-4 cursor-pointer'
                                onClick={() => handleRemoveOption(index)}
                            />
                        </div>
                    ))}
                    <button className='flex justify-end items-center' onClick={handleAddOption}>
                        <AddCircleRoundedIcon className='ml-12 mr-2' />
                        Add more options
                    </button>
                </div>
            </div>

            <div className='flex justify-end w-full absolute bottom-4 right-4'>
                <button className='bg-[#115E59] px-4 py-2 text-white' onClick={handleUpdate}>
                    Update
                </button>
                <button className='bg-[#115E59] px-4 py-2 text-white ml-2' onClick={handleRegisterAsNew}>
                    Register as New
                </button>
                <button className='bg-[#701216] px-4 py-2 text-white ml-2' onClick={handleDelete}>
                    Delete
                </button>
                <button className='bg-[#701216] px-4 py-2 text-white ml-2' onClick={() => setIsOpen(false)}>
                    Close
                </button>

            </div>
        </div>
    )
}

export default ModifyCategory
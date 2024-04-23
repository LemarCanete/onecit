import React, { useState } from 'react';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

const PriorityBox = ({ options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]); // Set default selected option

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="relative mr-4">
      <div
        className={`p-2 text-l font-bold rounded-[10px] ${selectedOption.specialClass} text-white cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FlagRoundedIcon className={`${selectedOption.specialClass}`}/> {selectedOption.label}
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 w-auto border border-gray-300 bg-white rounded-[10px]">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100 truncate"
              onClick={() => handleOptionClick(option)}
            >
              <FlagRoundedIcon className={`${option.flagColor}`}/> {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriorityBox;

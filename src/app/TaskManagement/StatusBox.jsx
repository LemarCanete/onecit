import React, { useState, useEffect } from 'react';

const StatusBox = ({ options, initialStatus, setStatus, isDisabled = false }) => {
  const initialOption = options.find((option) => option.value === initialStatus);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(initialOption || options[0]);

  const handleOptionClick = (option) => {
    if (isDisabled) return; // Don't allow changing if disabled
    setSelectedOption(option);
    setIsOpen(false);
    setStatus(option.value); // Inform parent of the status change
  };

  const handleToggleDropdown = () => {
    if (isDisabled) return; // Don't allow opening if disabled
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const newInitialOption = options.find((option) => option.value === initialStatus);
    setSelectedOption(newInitialOption || options[0]); // Update the selected option if initialStatus changes
  }, [initialStatus, options]); // Listen for changes in initialStatus and options

  return (
    <div className="relative mr-2">
      <div
        className={`p-2 text-l font-bold rounded-[10px] ${selectedOption.specialClass} text-white ${
          isDisabled ? 'opacity-100' : 'cursor-pointer'
        }`}
        onClick={handleToggleDropdown}
      >
        <div className="whitespace-nowrap">{selectedOption.label}</div>
      </div>
      {isOpen && !isDisabled && (
        <div className="absolute bottom-full left-0 mb-[1px] w-auto border border-gray-300 bg-white rounded-[10px]">
          {options.map((option, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-100 whitespace-nowrap w-full"
              onClick={() => handleOptionClick(option)}
            >
              <div>
                <label className={option.iconColor}>{option.icon}</label> {option.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatusBox;

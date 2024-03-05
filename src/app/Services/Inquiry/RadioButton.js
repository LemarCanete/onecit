// components/RadioButton.js

import React from 'react';

const RadioButton = ({ options, selectedOption, onOptionChange}) => {
  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    onOptionChange(selectedValue);
  };

  return (
    <div className=''>
      {options.map(option => (
        <div key={option.value} className='flex items-center'>
          <input
            type="radio"
            id={option.value}
            name="radioOptions"
            value={option.value}
            checked={selectedOption === option.value}
            onChange={handleOptionChange}
          />
          <label className='ml-[10px]' htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioButton;

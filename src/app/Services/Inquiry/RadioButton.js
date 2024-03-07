// components/RadioButton.js

import React from 'react';

const RadioButton = ({ options, selectedOption, onOptionChange}) => {

  return (
    <div className=''>
      {options.map(option => (
        <div key={option.value} className='flex items-center'>
          <input
            type="radio"
            id={option.value}
            name="guideoptions"
            value={option.value}
            //checked={selectedOption === option.value}
            onChange={() => onOptionChange(option.value)}
          />
          <label className='ml-[10px]' htmlFor={option.value}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default RadioButton;

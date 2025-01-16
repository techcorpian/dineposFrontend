import React, { useState } from 'react';

const CustomInput = ({ type, label, id, value, setValue }) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    if (value === '') {
      setFocused(false);
    }
  };

  return (
    <div className="relative w-full">
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => setValue(e.target.value)} 
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`block w-full px-4 py-3 text-lg bg-transparent border border-gray-500 rounded ${
          focused ? 'focus:outline-gray-500' : ''
        }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-3 transition-all duration-200 ease-in-out text-base cursor-text ${
          focused || value
            ? '-top-2 text-xs bg-gray-100 px-1 text-gray-600'
            : 'top-3.5 text-gray-900 px-1'
        }`}
      >
        {label}
      </label>
    </div>
  );
};

export default CustomInput;

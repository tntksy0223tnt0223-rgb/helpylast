
import React from 'react';

type InputProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  // Fix: Add placeholder prop to fix type error.
  placeholder?: string;
};

const Input: React.FC<InputProps> = ({ label, id, value, onChange, type = 'text', required = false, placeholder }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-400">
        {label}
      </label>
      <div className="mt-1">
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
    </div>
  );
};

export default Input;

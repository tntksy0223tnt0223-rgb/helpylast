import React from 'react';

type SelectProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  required?: boolean;
};

const Select: React.FC<SelectProps> = ({ label, id, value, onChange, children, required = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-400">
        {label}
      </label>
      <div className="mt-1">
        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          className="block w-full pl-3 pr-10 py-2 text-base bg-slate-700 border border-slate-600 text-slate-200 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
        >
          {children}
        </select>
      </div>
    </div>
  );
};

export default Select;
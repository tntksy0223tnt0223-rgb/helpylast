import React from 'react';

type TextareaProps = {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  placeholder?: string;
  name?: string;
  required?: boolean;
};

const Textarea: React.FC<TextareaProps> = ({ label, id, value, onChange, rows = 3, placeholder = '', name, required = false }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-400">
        {label}
      </label>
      <div className="mt-1">
        <textarea
          id={id}
          name={name || id}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          required={required}
          className="block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
      </div>
    </div>
  );
};

export default Textarea;

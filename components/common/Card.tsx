import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-lg overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
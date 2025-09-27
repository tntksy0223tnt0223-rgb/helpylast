import React from 'react';
import { View } from '../types';
import { NAV_ITEMS } from '../constants';
import Icon from './common/Icon';

interface HeaderProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setCurrentView }) => {
  return (
    <header className="bg-surface shadow-lg sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-lg">
              <Icon name="hospital" className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-100">헬피</h1>
          </div>
          <nav className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === item.name
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon name={item.icon} className="w-5 h-5" />
                <span>{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
        {/* Mobile Nav */}
        <nav className="md:hidden flex justify-around p-2 border-t border-slate-700">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.name}
                onClick={() => setCurrentView(item.name)}
                className={`flex flex-col items-center p-2 rounded-lg text-xs font-medium transition-colors w-1/6 ${
                  currentView === item.name
                    ? 'text-primary'
                    : 'text-slate-400 hover:bg-slate-700'
                }`}
              >
                <Icon name={item.icon} className="w-6 h-6 mb-1" />
                <span>{item.name}</span>
              </button>
            ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
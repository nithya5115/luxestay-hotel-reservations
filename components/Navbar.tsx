
import React from 'react';

interface NavbarProps {
  onViewChange: (view: 'rooms' | 'bookings') => void;
  currentView: 'rooms' | 'bookings';
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView }) => {
  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange('rooms')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-10V4m0 10V4m-4 5h.01M15 11h.01"></path>
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">Luxe<span className="text-indigo-600">Stay</span></span>
          </div>

          <div className="flex gap-4 sm:gap-8">
            <button 
              onClick={() => onViewChange('rooms')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${currentView === 'rooms' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Explore Rooms
            </button>
            <button 
              onClick={() => onViewChange('bookings')}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${currentView === 'bookings' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-slate-800'}`}
            >
              My Bookings
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="w-full flex items-center justify-between border-b border-[#edf3e7] dark:border-white/10 px-6 py-4 lg:px-12 bg-white/50 dark:bg-[#232e1a]/50 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-3 text-[#141b0d] dark:text-white hover:opacity-80 transition-opacity">
        <div className="size-8 text-[#73d411] flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">psychology_alt</span>
        </div>
        <h2 className="text-lg font-bold tracking-tight">LockItIn</h2>
      </Link>
      
      <div className="flex items-center gap-4 md:gap-8">
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-[#141b0d] dark:text-gray-200 text-sm font-medium hover:text-[#73d411] transition-colors">Home</Link>
          <a className="text-[#5c6b4f] dark:text-gray-400 text-sm font-medium hover:text-[#73d411] transition-colors" href="#">About</a>
          <a className="text-[#5c6b4f] dark:text-gray-400 text-sm font-medium hover:text-[#73d411] transition-colors" href="#">History</a>
        </nav>

        <div className="relative">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center size-10 rounded-full bg-[#f7f8f6] dark:bg-white/10 text-[#5c6b4f] dark:text-gray-300 hover:bg-[#73d411]/10 hover:text-[#73d411] transition-all border border-transparent hover:border-[#73d411]/20"
          >
            <span className="material-symbols-outlined text-2xl">account_circle</span>
          </button>

          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#232e1a] rounded-xl shadow-xl border border-[#edf3e7] dark:border-white/10 py-2 z-50 animate-fade-in">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#141b0d] dark:text-gray-200 hover:bg-[#f7f8f6] dark:hover:bg-white/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-xl">person</span>
                  Profile
                </Link>
                <Link 
                  to="/settings" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#141b0d] dark:text-gray-200 hover:bg-[#f7f8f6] dark:hover:bg-white/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="material-symbols-outlined text-xl">settings</span>
                  Settings
                </Link>
                <div className="border-t border-[#edf3e7] dark:border-white/10 my-1"></div>
                <button 
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Handle logout
                  }}
                >
                  <span className="material-symbols-outlined text-xl">logout</span>
                  Log Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

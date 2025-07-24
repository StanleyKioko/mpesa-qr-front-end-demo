import React from 'react';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Header = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // The App.js auth listener will handle redirection
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="bg-[#43b02a] shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-2 flex flex-col">
                <span className="text-xl font-bold text-white">M-PESA</span>
                <span className="text-xs text-white opacity-80">QR Payment System</span>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-white hover:text-yellow-200 font-medium">Dashboard</Link>
            <Link to="/scan" className="text-white hover:text-yellow-200 font-medium">Scan QR</Link>
            <button 
              onClick={handleLogout}
              className="text-white hover:text-yellow-200 font-medium flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zM2 4a2 2 0 012-2h5.586a1 1 0 01.707.293l6.414 6.414a1 1 0 01.293.707V16a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" clipRule="evenodd" />
                <path d="M10 9V6m0 3v3m0-3h3m-3 0H7" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
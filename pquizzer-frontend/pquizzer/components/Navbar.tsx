import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  user: any;
  onLogout: () => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, currentPage }) => {
  const isLinkActive = (path: string) => {
    if (path === '/' && currentPage === '/') return true;
    if (path !== '/' && currentPage.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/"
              className="flex-shrink-0 flex items-center"
            >
              <span className="text-2xl font-extrabold text-indigo-600 tracking-tight">PQuizzer</span>
            </Link>
            {user && (
              <div className="hidden sm:flex sm:space-x-4">
                <Link
                  to="/"
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${isLinkActive('/') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/leaderboard"
                  className={`px-3 py-2 rounded-md text-sm font-bold transition-all ${isLinkActive('/leaderboard') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Leaderboard
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 group p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isLinkActive('/profile') ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                    {(user.username || user.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <span className={`hidden md:block text-sm font-medium transition-colors ${isLinkActive('/profile') ? 'text-indigo-600' : 'text-gray-700 group-hover:text-indigo-600'}`}>
                    {user.username || user.email}
                  </span>
                </Link>
                <button
                  onClick={onLogout}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 px-4 py-2 rounded-lg text-sm font-semibold hover:text-indigo-600 transition-colors border border-transparent hover:border-indigo-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
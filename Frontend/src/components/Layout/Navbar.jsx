import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBook, FaUser, FaSignOutAlt, FaHome, FaHistory, FaList } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to={user?.role === 'admin' ? '/admin' : '/'} className="flex items-center space-x-2 text-xl font-bold">
            <FaBook className="text-2xl" />
            <span>Library MIS</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'admin' ? (
                  // Admin Navigation
                  <>
                    <Link 
                      to="/admin" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive('/admin') && !isActive('/admin/books') && !isActive('/admin/transactions') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    >
                      <FaHome />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link 
                      to="/admin/books" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive('/admin/books') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    >
                      <FaBook />
                      <span>Manage Books</span>
                    </Link>
                    
                    <Link 
                      to="/admin/transactions" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive('/admin/transactions') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    >
                      <FaHistory />
                      <span>Transactions</span>
                    </Link>
                  </>
                ) : (
                  // User Navigation
                  <>
                    <Link 
                      to="/" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    >
                      <FaHome />
                      <span>Home</span>
                    </Link>
                    
                    <Link 
                      to="/books" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive('/books') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    >
                      <FaBook />
                      <span>Books</span>
                    </Link>
                    
                    <Link 
                      to="/my-library" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive('/my-library') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    >
                      <FaList />
                      <span>My Library</span>
                    </Link>
                    
                    <Link 
                      to="/history" 
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${isActive('/history') ? 'bg-blue-700' : 'hover:bg-blue-700'}`}
                    >
                      <FaHistory />
                      <span>History</span>
                    </Link>
                  </>
                )}

                {/* User Profile Section */}
                <div className="flex items-center space-x-2 border-l pl-4 border-blue-500 ml-2">
                  <div className="p-2 bg-blue-500 rounded-full">
                    <FaUser />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.username}</span>
                    <span className="text-xs bg-blue-500 px-2 py-0.5 rounded">
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg transition ml-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 font-medium transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
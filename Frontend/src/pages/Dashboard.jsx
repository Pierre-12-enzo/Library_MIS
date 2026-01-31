import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookService, transactionService } from '../services';
import { FaBook, FaClock, FaHistory, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeBorrows: 0,
    overdueBooks: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeBorrows, setActiveBorrows] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [books, borrows] = await Promise.all([
        bookService.getAllBooks(),
        transactionService.getActiveBorrows()
      ]);

      const overdueBooks = borrows.data.filter(t => new Date(t.dueDate) < new Date());

      setStats({
        totalBooks: books.data.length,
        activeBorrows: borrows.data.length,
        overdueBooks: overdueBooks.length
      });

      setActiveBorrows(borrows.data.slice(0, 3)); // Show only 3 recent
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.username}!</h1>
      <p className="text-gray-600 mb-8">Manage your library activities</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaBook className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Available Books</p>
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaClock className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Borrows</p>
              <p className="text-2xl font-bold">{stats.activeBorrows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <FaHistory className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold">{stats.overdueBooks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/books"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            Browse Books
          </Link>
          <Link
            to="/my-library"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            My Library
          </Link>
          <Link
            to="/history"
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            View History
          </Link>
        </div>
      </div>

      {/* Recent Active Borrows */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your Active Borrows</h2>
          <Link to="/my-library" className="text-blue-600 hover:text-blue-800 flex items-center">
            View All <FaArrowRight className="ml-1" />
          </Link>
        </div>
        
        {activeBorrows.length === 0 ? (
          <div className="text-center py-8">
            <FaBook className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">You don't have any active borrows</p>
            <Link to="/books" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
              Browse books to borrow
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeBorrows.map(borrow => {
              const isOverdue = new Date(borrow.dueDate) < new Date();
              
              return (
                <div key={borrow._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">{borrow.book.title}</h3>
                  <p className="text-gray-600 mb-3">by {borrow.book.author}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Due Date:</span>
                      <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-800'}>
                        {new Date(borrow.dueDate).toLocaleDateString()}
                        {isOverdue && ' (Overdue)'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isOverdue ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                      </span>
                    </div>
                  </div>
                  
                  <Link
                    to="/my-library"
                    className="mt-4 block text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                  >
                    Return Book
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
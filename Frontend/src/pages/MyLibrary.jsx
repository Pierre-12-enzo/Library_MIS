import React, { useEffect, useState } from 'react';
import { transactionService } from '../services';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaCalendar, FaClock, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyLibrary = () => {
  const { user } = useAuth();
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveBorrows();
  }, []);

  const fetchActiveBorrows = async () => {
    try {
      const response = await transactionService.getActiveBorrows();
      setActiveBorrows(response.data);
    } catch (error) {
      console.error('Error fetching active borrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (transactionId) => {
    try {
      await transactionService.returnBook(transactionId);
      alert('Book returned successfully!');
      fetchActiveBorrows(); // Refresh list
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to return book');
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Library</h1>
        <Link
          to="/books"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          Browse More Books
        </Link>
      </div>

      {activeBorrows.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No active borrows</h3>
          <p className="text-gray-500 mb-4">You haven't borrowed any books yet.</p>
          <Link
            to="/books"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeBorrows.map(borrow => {
            const dueDate = new Date(borrow.dueDate);
            const isOverdue = dueDate < new Date();
            
            return (
              <div key={borrow._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {borrow.book.title}
                      </h3>
                      <p className="text-gray-600 mb-4">by {borrow.book.author}</p>
                      
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <FaCalendar className="text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            Borrowed: {new Date(borrow.borrowDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex items-center">
                          <FaClock className={`mr-2 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                          <span className={isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                            Due: {dueDate.toLocaleDateString()}
                            {isOverdue && ' (Overdue)'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {isOverdue ? 'Overdue' : 'Active'}
                      </span>
                      
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                      >
                        Return Book
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600">
                      <span className="font-semibold">Genre:</span> {borrow.book.genre}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyLibrary;
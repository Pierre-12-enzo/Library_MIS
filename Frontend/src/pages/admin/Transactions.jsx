import React, { useEffect, useState } from 'react';
import { transactionService } from '../../services';
import { FaFilter, FaSearch, FaUser, FaBook, FaCalendar } from 'react-icons/fa';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, returned, overdue
  const [userFilter, setUserFilter] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = 
      t.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      t.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      t.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.book?.author?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      filter === 'all' || 
      t.status === filter ||
      (filter === 'active' && t.status === 'active') ||
      (filter === 'returned' && t.status === 'returned') ||
      (filter === 'overdue' && t.status === 'overdue');
    
    const matchesUser = !userFilter || 
      t.user?.username?.toLowerCase().includes(userFilter.toLowerCase()) ||
      t.user?.email?.toLowerCase().includes(userFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesUser;
  });

  const getStats = () => {
    const active = transactions.filter(t => t.status === 'active').length;
    const returned = transactions.filter(t => t.status === 'returned').length;
    const overdue = transactions.filter(t => t.status === 'overdue').length;
    return { active, returned, overdue, total: transactions.length };
  };

  const stats = getStats();

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
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Transactions</h1>
          <p className="text-gray-600">View and monitor all borrowing activities</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Transactions</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
          <div className="text-sm text-gray-600">Active Borrows</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{stats.returned}</div>
          <div className="text-sm text-gray-600">Returned</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, book, author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by username..."
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="returned">Returned Only</option>
              <option value="overdue">Overdue Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const isOverdue = transaction.status === 'overdue';
                  const isReturned = transaction.status === 'returned';
                  
                  return (
                    <tr key={transaction._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.user?.username || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.user?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <FaBook className="text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {transaction.book?.title || 'Unknown Book'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {transaction.book?.author}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.type === 'borrow' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <FaCalendar className="inline mr-1" />
                          {new Date(transaction.borrowDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Due: {new Date(transaction.dueDate).toLocaleDateString()}
                          {isReturned && transaction.returnDate && (
                            <div className="text-green-600">
                              Returned: {new Date(transaction.returnDate).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          isOverdue ? 'bg-red-100 text-red-800' :
                          isReturned ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;

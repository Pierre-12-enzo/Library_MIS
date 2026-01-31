import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookService, transactionService } from '../../services';
import { FaBook, FaUsers, FaHistory, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeBorrows: 0,
    overdueBooks: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [books, transactions] = await Promise.all([
        bookService.getAllBooks(),
        transactionService.getAllTransactions()
      ]);

      const activeBorrows = transactions.data.filter(t => t.status === 'active');
      const overdueBooks = activeBorrows.filter(t => new Date(t.dueDate) < new Date());

      setStats({
        totalBooks: books.data.length,
        activeBorrows: activeBorrows.length,
        overdueBooks: overdueBooks.length,
        totalTransactions: transactions.data.length
      });

      // Get recent 5 transactions
      setRecentTransactions(transactions.data.slice(0, 5));
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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome back, {user.username}!</p>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FaBook className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Books</p>
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Borrows</p>
              <p className="text-2xl font-bold">{stats.activeBorrows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <FaClock className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold">{stats.overdueBooks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <FaHistory className="text-2xl" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold">{stats.totalTransactions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - ADMIN ONLY */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/books"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
          >
            <FaBook className="inline mr-2" />
            Manage Books
          </Link>
          <Link
            to="/admin/transactions"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
          >
            <FaHistory className="inline mr-2" />
            Manage Transactions
          </Link>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
          <Link to="/admin/transactions" className="text-blue-600 hover:text-blue-800 font-medium">
            View All →
          </Link>
        </div>
        
        {recentTransactions.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No transactions yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentTransactions.map((t) => (
                  <tr key={t._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {t.user?.username || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-500">{t.user?.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {t.book?.title || 'Unknown Book'}
                      </div>
                      <div className="text-sm text-gray-500">{t.book?.author}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        t.type === 'borrow' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        t.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                        t.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
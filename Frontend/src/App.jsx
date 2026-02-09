import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Common/ProtectedRoute';
import Layout from './components/Layout/Layout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import MyLibrary from './pages/MyLibrary';
import History from './pages/History';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import ManageBooks from './pages/admin/ManageBooks';
import AdminTransactions from './pages/admin/Transactions';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* User Protected Routes */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/my-library" element={<MyLibrary />} />
            <Route path="/history" element={<History />} />
          </Route>
          
          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute adminOnly><Layout /></ProtectedRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/books" element={<ManageBooks />} />
            <Route path="/admin/transactions" element={<AdminTransactions />} />
          </Route>
          
          {/* Catch all - redirect based on role */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
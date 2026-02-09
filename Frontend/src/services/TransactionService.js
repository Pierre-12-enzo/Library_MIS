import api from './api';

export const transactionService = {
  borrowBook: (bookId) => api.post('/transactions/borrow', { bookId }),
  returnBook: (transactionId) => api.post('/transactions/return', { transactionId }),
  getUserHistory: () => api.get('/transactions/user/history'),
  getActiveBorrows: () => api.get('/transactions/user/active'),
  getAllTransactions: () => api.get('/transactions/all'),
};

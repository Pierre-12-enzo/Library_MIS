import React, { useEffect, useState } from 'react';
import BookCard from '../components/Common/BookCard';
import { bookService, transactionService } from '../services';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaFilter } from 'react-icons/fa';

const Books = () => {

  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksRes, borrowsRes] = await Promise.all([
        bookService.getAllBooks(),
        user.role === 'user' ? transactionService.getActiveBorrows() : { data: [] }
      ]);

      setBooks(booksRes.data);
      setActiveBorrows(borrowsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId) => {
    try {
      await transactionService.borrowBook(bookId);
      alert('Book borrowed successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to borrow book');
    }
  };

  const handleReturn = async (transactionId) => {
    try {
      await transactionService.returnBook(transactionId);
      alert('Book returned successfully!');
      fetchData(); // Refresh data
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to return book');
    }
  };

  const getBorrowedBookId = (bookId) => {
    const borrow = activeBorrows.find(b => b.book._id === bookId);
    return borrow ? borrow._id : null;
  };

  const genres = [...new Set(books.map(book => book.genre))];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
                         book.author.toLowerCase().includes(search.toLowerCase()) ||
                         book.isbn.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = !genreFilter || book.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

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
        <h1 className="text-3xl font-bold text-gray-800">Books</h1>
        <div className="text-gray-600">
          Showing {filteredBooks.length} of {books.length} books
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">All Genres</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <FaSearch className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No books found</h3>
          <p className="text-gray-500">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map(book => (
            <BookCard
              key={book._id}
              book={book}
              onBorrow={handleBorrow}
              onReturn={handleReturn}
              userBorrowedId={getBorrowedBookId(book._id)}
              isAdmin={user.role === 'admin'}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;
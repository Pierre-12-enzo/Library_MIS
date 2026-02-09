import React, { useEffect, useState } from 'react';
import { bookService } from '../../services';
import { FaEdit, FaTrash, FaPlus, FaBook } from 'react-icons/fa';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    genre: '',
    description: '',
    quantity: 1
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBooks();
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook._id, formData);
        alert('Book updated successfully!');
      } else {
        await bookService.createBook(formData);
        alert('Book added successfully!');
      }
      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      genre: book.genre,
      description: book.description,
      quantity: book.quantity
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        alert('Book deleted successfully!');
        fetchBooks();
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      genre: '',
      description: '',
      quantity: 1
    });
    setEditingBook(null);
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
        <h1 className="text-3xl font-bold text-gray-800">Manage Books</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus className="mr-2" />
          Add New Book
        </button>
      </div>

      {/* Books Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author & ISBN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Genre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaBook className="text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {book.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {book.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{book.author}</div>
                    <div className="text-sm text-gray-500">{book.isbn}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {book.genre}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {book.available}/{book.quantity} available
                    </div>
                    <div className={`text-xs ${book.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {book.available > 0 ? 'In stock' : 'Out of stock'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(book._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
            <div className="border-b border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {editingBook ? 'Update book information' : 'Add a new book to the library'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Enter book title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Author name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISBN <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="ISBN number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Genre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="e.g., Fiction, Science, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Brief description of the book..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingBook ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBooks;

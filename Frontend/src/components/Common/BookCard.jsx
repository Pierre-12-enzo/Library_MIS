import React from 'react';
import { FaBook, FaUser, FaHashtag } from 'react-icons/fa';

const BookCard = ({ book, onBorrow, onReturn, userBorrowedId, isAdmin = false }) => {
  const isAvailable = book.available > 0;
  const isBorrowed = !!userBorrowedId;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{book.title}</h3>
            <div className="flex items-center text-gray-600 mb-1">
              <FaUser className="mr-2" />
              <span>{book.author}</span>
            </div>
            <div className="flex items-center text-gray-600 mb-3">
              <FaHashtag className="mr-2" />
              <span>ISBN: {book.isbn}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isAvailable ? 'Available' : 'Out of Stock'}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{book.description}</p>

        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {book.genre}
            </span>
            <span className="text-gray-600">
              {book.available}/{book.quantity} available
            </span>
          </div>

          <div className="flex space-x-2">
            {!isAdmin && (
              <>
                <button
                  onClick={() => onBorrow(book._id)}
                  disabled={!isAvailable || isBorrowed}
                  className={`px-4 py-2 rounded font-medium ${isAvailable && !isBorrowed
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                  {isBorrowed ? 'Borrowed' : 'Borrow'}
                </button>

                {isBorrowed && (
                  <button
                    onClick={() => onReturn(userBorrowedId)}
                    className="px-4 py-2 rounded font-medium bg-green-600 hover:bg-green-700 text-white"
                  >
                    Return
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
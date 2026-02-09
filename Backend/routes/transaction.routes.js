const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Book = require('../models/Book');
const { auth, adminAuth } = require('../middleware/auth');

// BORROW A BOOK (User only)
router.post('/borrow', auth, async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user._id;

        console.log('Borrow attempt:', { userId, bookId });

        // Check if book exists and is available
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.available <= 0) {
            return res.status(400).json({ message: 'Book is not available for borrowing' });
        }

        // Check if user already has an active borrow for this book
        const existingBorrow = await Transaction.findOne({
            user: userId,
            book: bookId,
            type: 'borrow',
            status: 'active'
        });

        if (existingBorrow) {
            return res.status(400).json({ message: 'You have already borrowed this book' });
        }

        // Create transaction WITHOUT middleware issues
        const transactionData = {
            user: userId,
            book: bookId,
            type: 'borrow',
            status: 'active'
        };

        // Manually set due date
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);
        transactionData.dueDate = dueDate;

        const transaction = await Transaction.create(transactionData);

        // Update book availability
        book.available -= 1;
        await book.save();

        // Populate user and book details
        await transaction.populate('user', 'username email');
        await transaction.populate('book', 'title author');

        console.log('Borrow successful:', transaction._id);

        res.status(201).json(transaction);
    } catch (error) {
        console.error('Borrow error details:', error);
        res.status(500).json({
            message: 'Server error during borrowing',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// RETURN A BOOK (User only)
router.post('/return', auth, async (req, res) => {
    try {
        const { transactionId } = req.body;
        const userId = req.user._id;

        console.log('Return attempt:', { userId, transactionId });

        // Find the active borrow transaction
        const borrowTransaction = await Transaction.findOne({
            _id: transactionId,
            user: userId,
            type: 'borrow',
            status: 'active'
        });

        if (!borrowTransaction) {
            return res.status(404).json({ message: 'No active borrow found' });
        }

        // Create return transaction WITHOUT middleware issues
        const returnTransactionData = {
            user: userId,
            book: borrowTransaction.book,
            type: 'return',
            borrowDate: borrowTransaction.borrowDate,
            dueDate: borrowTransaction.dueDate,
            status: 'returned', // Manually set status
            returnDate: new Date() // Manually set return date
        };

        const returnTransaction = await Transaction.create(returnTransactionData);

        // Update borrow transaction status
        borrowTransaction.status = 'borrowed';
        borrowTransaction.returnDate = new Date();
        await borrowTransaction.save();

        // Update book availability
        const book = await Book.findById(borrowTransaction.book);
        if (book) {
            book.available += 1;
            await book.save();
        }

        // Populate details
        await returnTransaction.populate('user', 'username email');
        await returnTransaction.populate('book', 'title author');

        console.log('Return successful');

        res.json(returnTransaction);
    } catch (error) {
        console.error('Return error details:', error);
        res.status(500).json({
            message: 'Server error during return',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// GET USER'S TRANSACTION HISTORY (User only)
router.get('/user/history', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id })
            .populate('book', 'title author isbn')
            .sort('-createdAt');

        res.json(transactions);
    } catch (error) {
        console.error('History error:', error);
        res.status(500).json({ message: 'Server error fetching history' });
    }
});

// GET USER'S ACTIVE BORROWS (User only)
router.get('/user/active', auth, async (req, res) => {
    try {
        const activeBorrows = await Transaction.find({
            user: req.user._id,
            type: 'borrow',
            status: 'active'
        })
            .populate('book', 'title author genre')
            .sort('-createdAt');

        res.json(activeBorrows);
    } catch (error) {
        console.error('Active borrows error:', error);
        res.status(500).json({ message: 'Server error fetching active borrows' });
    }
});

// GET ALL TRANSACTIONS (Admin only)
router.get('/all', auth, adminAuth, async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('user', 'username email')
            .populate('book', 'title author')
            .sort('-createdAt');

        res.json(transactions);
    } catch (error) {
        console.error('All transactions error:', error);
        res.status(500).json({ message: 'Server error fetching all transactions' });
    }
});

module.exports = router;

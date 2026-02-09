const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { auth, adminAuth } = require('../middleware/auth');

// GET ALL BOOKS (Public)
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET SINGLE BOOK (Public)
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CREATE BOOK (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
    try {
        const { title, author, isbn, genre, description, quantity } = req.body;
        
        const book = await Book.create({
            title,
            author,
            isbn,
            genre,
            description,
            quantity,
            available: quantity
        });
        
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE BOOK (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            if (key === 'quantity') {
                const diff = req.body.quantity - book.quantity;
                book.available = Math.max(0, book.available + diff);
            }
            book[key] = req.body[key];
        });

        await book.save();
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE BOOK (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.deleteOne();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
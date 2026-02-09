const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    genre: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    available: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

// FIXED: Remove the async middleware that's causing issues
bookSchema.pre('save', function(next) {
    const book = this;
    
    // Ensure available doesn't exceed quantity
    if (book.available > book.quantity) {
        book.available = book.quantity;
    }
    
    // Call next
    if (typeof next === 'function') {
        next();
    }
});

// Virtual for checking availability (no middleware issues here)
bookSchema.virtual('isAvailable').get(function() {
    return this.available > 0;
});

module.exports = mongoose.model('Book', bookSchema);
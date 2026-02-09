const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    type: {
        type: String,
        enum: ['borrow', 'return'],
        required: true
    },
    borrowDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        default: function() {
            const date = new Date();
            date.setDate(date.getDate() + 14); // 14 days from now
            return date;
        }
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
    }
}, {
    timestamps: true
});

// FIXED: Use callback style, remove async
transactionSchema.pre('save', function(next) {
    const transaction = this;
    
    // Set status based on type and dates
    if (transaction.type === 'return') {
        transaction.status = 'returned';
        transaction.returnDate = new Date();
    } else if (transaction.dueDate < new Date() && transaction.status !== 'returned') {
        transaction.status = 'overdue';
    }
    
    // Always call next
    if (typeof next === 'function') {
        next();
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);
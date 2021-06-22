const mongoose = require('mongoose');

const transactionItemSchema = new mongoose.Schema({
    productRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    seller: {
        type: String,
        required: true,
        index: true
    }
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    transactionAmount: {
        type: Number,
        required: true
    },
    transactionItems: [transactionItemSchema]
});

const Transaction = mongoose.Model('transaction', transactionSchema);

module.exports = Transaction;
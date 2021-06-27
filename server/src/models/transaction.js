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
});

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
}, { timestamps: true });

const Transaction = mongoose.model('transaction', transactionSchema);

module.exports = Transaction;
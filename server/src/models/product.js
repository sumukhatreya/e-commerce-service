const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    seller: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number
    },
    available: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('product', productSchema);
module.exports = Product;
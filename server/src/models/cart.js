const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    productRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }, 
    productTitle: {
        type: String,
        required: true 
    },
    seller: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    }
});

const cartSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        
    },
    totalCost: {
        type: Number,
        required: true,
        default: 0
    },
    shippingAddress: {
        type: String
    },
    cartItems: [cartItemSchema]
});

const Cart = mongoose.Model('cartItem', cartSchema);

module.exports = Cart;
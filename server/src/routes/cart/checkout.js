const { Router } = require('express');
const Cart = require('../../models/cart');
const Transaction = require('../../models/transaction');
const { verifyJWT } = require('../../utils');
const router = Router();

// Get checkout page details
router.get('/', async (req, res, next) => {
    try {
        // const header = verifyJWT(req);
        const header = "ssa";
        if (!header) {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const cartSummary = await Cart.findOne({ username: header }, 'numOfItems totalCost shippingAddress');
        res.status(200).json(cartSummary);
    } catch (err) {
        next(err);
    }
});

// Process transaction
router.post('/', async (req, res, next) => {
    try {
        // const header = verifyJWT(req);
        const header = "ssa";
        if (!header) {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const cart = await Cart.findOne({ username: header });
        if (cart.cartItems.length === 0) {
            res.status(404);
            throw new Error('No items found in cart');
        }
        const transaction = new Transaction();
        transaction.username = cart.username;
        transaction.transactionAmount = cart.totalCost;
        transaction.transactionItems = cart.cartItems;
        const userTransaction = await transaction.save();
        // res.status(200).json({ 
        //     message: 'Transaction processed',
        //     id: transaction._id
        // });
        res.status(201).json(userTransaction);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
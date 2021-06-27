const { Router } = require('express');
const { verifyJWT } = require('../../utils');
const Cart = require('../../models/cart');
const Product = require('../../models/product');
const checkout = require('./checkout');

const router = Router();


// Get cart page.
router.get('/', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        // const header = "ssa";
        if (!header) {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const cartItems = await Cart.findOne({ username: header });
        res.status(200).json(cartItems);
    } catch (err) {
        next(err);
    }
});

// Add  item to cart (unhappy with error handling for duplicate entries).
router.post('/', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        // const header = "ssa";
        if (!header) {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        if (await Cart.findOne({ username: header, 'cartItems.productRef': req.body.id })) {
            res.status(409);
            throw new Error('Resource already exists');
        }
        const productEntry = await Product.findById(req.body.id);
        const cartEntry = {
            productRef: productEntry,
            productTitle: productEntry.title,
            seller: productEntry.seller,
            price: productEntry.price,
            rating: productEntry.rating
        };
        const userCart = await Cart.findOneAndUpdate({ username: header }, 
            { $push: { cartItems: cartEntry }, 
              $inc: { totalCost: productEntry.price, numOfItems: 1 }}, 
            { new: true }
        );
        // res.status(201).json({ message: 'Item added to cart'});
        res.status(201).json(userCart);
    } catch (err) {
        next(err);
    }
});

// Remove item from cart (unhappy with error handling here as well).
router.delete('/', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        // const header = "ssa";
        if(!header) {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        if (!(await Cart.findOne({ username: header, 'cartItems.productRef': req.body.id }))) {
            res.status(404);
            throw new Error('Resource does not exist');
        }
        const cart = await Cart.findOneAndUpdate({ username: header, 'cartItems.productRef': req.body.id }, 
            { $pull: { cartItems: { productRef: req.body.id }}, 
              $inc: { totalCost: -req.body.price, numOfItems: -1 }}, 
            { new: true }
        );
        // res.status(200).json({ message: 'Entry deleted' });
        res.status(200).json(cart);
    } catch (err) {
        next(err);
    }
});

router.use('/checkout', checkout);

module.exports = router;
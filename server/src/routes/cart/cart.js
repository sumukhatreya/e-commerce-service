const { Router } = require('express');

const router = Router();
const checkout = require('./checkout');

// Get cart page
router.get('/', async (req, res, next) => {
    try {

    } catch (err) {

    }
});

// Add  item to cart
router.post('/', async (req, res, next) => {
    try {

    } catch (err) {

    }
});

// Remove item from cart
router.delete('/', async (req, res, next) => {
    try {

    } catch (err) {

    }
});

router.use('/checkout', checkout);

module.exports = router;
const { Router } = require('express');
const ProductEntry = require('../models/product');

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const newProduct = new ProductEntry(req.body);
        const createdEntry = await newProduct.save();
        res.status(201).json({ message: `Product entry with id ${createdEntry._id} created.`});
    } catch (err) {
        next(err);
    }
});





module.exports = router;
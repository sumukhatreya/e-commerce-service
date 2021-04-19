const { Router } = require('express');
const ProductEntry = require('../models/product');
const RatingsAndReviews = require('../models/productRatingsAndReviews');

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const productRatingsAndReviews = new RatingsAndReviews();
        const newProduct = new ProductEntry(req.body);
        productRatingsAndReviews.productRef = newProduct;
        newProduct.ratingsRef = productRatingsAndReviews
        await productRatingsAndReviews.save();
        const createdEntry = await newProduct.save();
        res.status(201).json(createdEntry);
        // res.status(201).json({ message: `Product entry with id ${createdEntry._id} created.`});
    } catch (err) {
        next(err);
    }
});





module.exports = router;
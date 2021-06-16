const { Router } = require('express');
const ProductEntry = require('../models/product');
const RatingsAndReviews = require('../models/productRatingsAndReviews');
const { verifyJWT } = require('../utils');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const isLoggedIn = verifyJWT(req);
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': isLoggedIn };
        res.set(headers);
        const products = await ProductEntry.find({ available: true }, 'image title price rating'); // I had .sort({ createdAt: -1 }) chained to the end of this. I don't think this is necessary since I'm maintaining an index on createdAt, sorted in descending order.
        res.status(200).json(products);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        // const product = await ProductEntry.findById(req.params.id).populate('ratingsRef', 'ratingsAndReviews',  RatingsAndReviews);
        console.log('Heres the id in the id route', req.params.id);
        const product = await ProductEntry.findOne({_id: req.params.id}).populate('ratingsRef', 'ratingsAndReviews', RatingsAndReviews);
        if (!product.available) {
            res.status(404);
            throw new Error('Resource removed');
        }
        console.log(product);
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
});

// Add to cart
router.post('/:id', async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
});

router.get('/:id/review', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        // const header = 'ssa';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        console.log('Heres the id', req.params);
        // I could maybe even use ratingsAndReviews.usernmae: header instead of the positional elemMatch operator.
        const userReview = await RatingsAndReviews.findOne(
            { productRef: req.params.id }, 
            { ratingsAndReviews: { $elemMatch: { 'username': header }}}
        );
        console.log(userReview);
        if (userReview.ratingsAndReviews.length === 0) {
            res.status(204).json({ message: 'No data'});
        } else {
            console.log('userReview', userReview.ratingsAndReviews[0]);
            res.status(200).json(userReview.ratingsAndReviews[0]);
        }
    } catch (err) {
        next(err);
    }
});

router.post('/:id/review', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        // const header = 'ada';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        if (await RatingsAndReviews.findOne({ productRef: req.params.id, 'ratingsAndReviews.username': header })) {
            res.status(409);
            throw new Error('Entry already exists');
        }
        const userRating = {
            username: header,
            rating: req.body.rating,
            review: req.body.review,
            lastUpdated: Date.now()
        };
        const ratingAndReviewEntry = await RatingsAndReviews.findOneAndUpdate(
            { productRef: req.params.id }, 
            { $push: { ratingsAndReviews: userRating },  $inc: { ratingsAggregate: req.body.rating, numOfRatings: 1 }}, 
            { new: true }
        );
        // console.log('ratingAndReviews', ratingAndReviewEntry);
        const updatedRating = (ratingAndReviewEntry.ratingsAggregate / ratingAndReviewEntry.numOfRatings).toFixed(1);
        // console.log(updatedRating);
        const productEntry = await ProductEntry.findByIdAndUpdate({ _id: req.params.id }, { rating: updatedRating }, { new: true });
        console.log(productEntry);
        res.status(201).json(ratingAndReviewEntry);
    } catch (err) {
        next(err);
    }
});

router.put('/:id/review', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        // const header = 'ada';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        } 
        const netUserRating = req.body.rating - req.body.oldRating;
        const ratingAndReviewEntry = await RatingsAndReviews.findOneAndUpdate(
            { productRef: req.params.id, 'ratingsAndReviews.username': header }, 
            { $set: 
                { 'ratingsAndReviews.$.review': req.body.review, 
                  'ratingsAndReviews.$.rating': req.body.rating, 
                  'ratingsAndReviews.$.lastUpdated': Date.now() 
                },
              $inc: { ratingsAggregate: netUserRating }
            }, 
            { new: true }
        );
        console.log(ratingAndReviewEntry);
        const updatedRating = (ratingAndReviewEntry.ratingsAggregate / ratingAndReviewEntry.numOfRatings).toFixed(1);
        const productEntry = await ProductEntry.findByIdAndUpdate({ _id: req.params.id }, { rating: updatedRating}, { new: true });
        console.log(productEntry);
        res.status(200).json(ratingAndReviewEntry);
    } catch (err) {
        next(err);
    }
});

router.delete('/:id/review', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        // const header = 'ada';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const ratingAndReviewEntry = await RatingsAndReviews.findOneAndUpdate(
            { productRef: req.params.id, 'ratingsAndReviews.username': header }, 
            { $pull: { ratingsAndReviews: { username: header }}, $inc: { ratingsAggregate: -req.body.rating, numOfRatings: -1 }}, 
            { new: true }
        );
        let updatedRating = null;
        if (ratingAndReviewEntry.numOfRatings > 0) {
            updatedRating = (ratingAndReviewEntry.ratingsAggregate / ratingAndReviewEntry.numOfRatings).toFixed(1); 
        } else {
            updatedRating = 0;
        }
        const productEntry = await ProductEntry.findByIdAndUpdate({ _id: req.params.id }, { rating: updatedRating}, { new: true });
        console.log(productEntry);
        res.status(200).json(ratingAndReviewEntry);
    } catch (err) {
        next(err);
    }
});



module.exports = router;
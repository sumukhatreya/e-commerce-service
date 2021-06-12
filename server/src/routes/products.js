const { Router } = require('express');
const { findOne } = require('../models/product');
const ProductEntry = require('../models/product');
const RatingsAndReviews = require('../models/productRatingsAndReviews');
const { verifyJWT } = require('../utils');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const isLoggedIn = verifyJWT(req);
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': isLoggedIn };
        res.set(headers);
        const productEntries = await ProductEntry.find({ available: true }, 'image title price rating'); // I had .sort({ createdAt: -1 }) chained to the end of this. I don't think this is necessary since I'm maintaining an index on createdAt, sorted in descending order.
        res.status(200).json(productEntries);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const product = await ProductEntry.findById(req.params.id).populate('ratingsRef', 'ratingsAndReviews',  RatingsAndReviews);
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
        // const header = verifyJWT(req);
        const header = 'ada';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        // The following code is inefficient: I'm loading the entire document from memory and then searching for the relevant review entry, instead of directly loading the relevant review object from the database in a single atomic operation (I couldn't figure out how to do this - see comment below).
        let userReview = null;
        const ratingAndReviewEntry = await RatingsAndReviews.findOne({ productRef: req.params.id, 'ratingsAndReviews.username': header }, 'ratingsAndReviews');
        console.log('ratingAndReviewEntry', ratingAndReviewEntry);
        if (!ratingAndReviewEntry) {
            res.status(204);
        } else {
            userReview = ratingAndReviewEntry.ratingsAndReviews.find(entry => entry.username === header);
            res.status(200);
        }
        // The below (commented) line of code works, but it returns the entire document, not only the relevant subdocument, if there's a match. This seems to be the case with MongoDB. Every tutorial I've looked at for subdocument retrieval from an array says the same thing. I suppose I'll have to iterate through the entire document at the application level to find the relevant subdocument.
        // const userReview = await RatingsAndReviews.findOne({ productRef: req.params.id, ratingsAndReviews: { $elemMatch: { 'username': 'groucho' } } });
        console.log('userReview', userReview);
        res.json(userReview);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/review', async (req, res, next) => {
    try {
        // const header = verifyJWT(req);
        const header = 'alan';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const userRating = {
            username: header,
            rating: req.body.rating,
            review: req.body.review,
            lastUpdated: Date.now()
        };
        const ratingAndReviewEntry = await RatingsAndReviews.findOneAndUpdate({ productRef: req.params.id }, { $push: { ratingsAndReviews: userRating },  $inc: { ratingsAggregate: req.body.rating , numOfRatings: 1 }}, { new: true });
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
        // const header = verifyJWT(req);
        const header = 'ada';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        } 
        const netUserRating = req.body.oldRating - req.body.rating;
        const ratingAndReviewEntry = await RatingsAndReviews.findOneAndUpdate({ productRef: req.params.id, 'ratingsAndReviews.username': header }, 
        { $set: 
            { 'ratingsAndReviews.$.review': req.body.review, 
              'ratingsAndReviews.$.rating': req.body.rating, 
              'ratingsAndReviews.$.lastUpdated': Date.now() 
            },
          $inc: { ratingsAggregate: netUserRating }
        }, 
        { new: true });
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
        // const header = verifyJWT(req);
        const header = 'ssa';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const ratingAndReviewEntry = await RatingsAndReviews.findOneAndUpdate({ productRef: req.params.id, 'ratingsAndReviews.username': header }, { $pull: { ratingsAndReviews: { username: header }}, $inc: { ratingsAggregate: -req.body.rating, numOfRatings: -1 }}, { new: true });

        const updatedRating = (ratingAndReviewEntry.ratingsAggregate / ratingAndReviewEntry.numOfRatings).toFixed(1);

        const productEntry = await ProductEntry.findByIdAndUpdate({ _id: req.params.id }, { rating: updatedRating}, { new: true });

        console.log(productEntry);

        res.status(200).json(ratingAndReviewEntry);
    } catch (err) {
        next(err);
    }
});



module.exports = router;
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
        const header = 'quack';
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }

        // The following code is very inefficient; I'm loading the entire document from memory and then searching for the relevant review entry, instead of directly loading the particular review entry object from the database in a single atomic operation (I couldn't figure out how to do this - see comment below).
        const ratingAndReviewEntry = await RatingsAndReviews.findOne({ productRef: req.params.id }, 'ratingsAndReviews');
        console.log('ratingAndReviewEntry', ratingAndReviewEntry);
        const userReview = ratingAndReviewEntry.ratingsAndReviews.find(entry => entry.username === header);

        // The below line of code works, but it returns the entire document, not only the relevant subdocument, if there's a match. This seems to be the case with MongoDB. Every tutorial I've looked at for subdocument retrieval from an array says the same thing. I suppose I'll have to iterate through the entire document at the application level to find the relevant subdocument.
        // const userReview = await RatingsAndReviews.findOne({ productRef: req.params.id, ratingsAndReviews: { $elemMatch: { 'username': 'groucho' } } });
        console.log('userReview', userReview);
        res.status(200).json(userReview);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/review', async (req, res, next) => {
    try {
        // const header = verifyJWT(req);
        const header = 'grouchomarx2';
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

// Unhappy with this code. I had wanted to use Mongoose queries to retrieve and update subdocuments within the ratingsAndReviews array, but I couldn't figure out how. I'll revisit this code later.
router.put('/:id/review', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const ratingAndReviewEntry = await RatingsAndReviews.find({ productRef: req.params.id });
        // ratingAndReviewEntry.
        // console.log(ratingAndReviewEntry);
        const ratingArray = ratingAndReviewEntry[0].ratingsAndReviews;
        let desiredEntry = ratingArray.find(entry => entry.username === header);
        // console.log(desiredEntry);
        desiredEntry.rating = req.body.rating;
        desiredEntry.review = req.body.review;
        desiredEntry.lastUpdated = Date.now();
        // console.log(desiredEntry);
        res.status(200).json({ message: 'Rating and review entry modified' });
    } catch (err) {
        next(err);
    }
});

router.delete('/:id/review', async (req, res, next) => {
    try {
        // const header = 'ssa';
        // const result = await RatingsAndReviews.findByIdAndUpdate(req.params.id, {
        //     $pull: {
        //         ratingsAndReviews: {
        //             'username': header
        //         }
        //     }
        // });
        // res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});



module.exports = router;
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
        const productEntries = await ProductEntry.find({ available: true }, 'image title price rating')
                                                 .sort({ createdAt: -1 });
        res.status(200).json(productEntries);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log('Params Id', id);
        const product = await ProductEntry.findById(id).populate('ratingsRef', 'ratingsAndReviews', RatingsAndReviews);
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

router.post('/:id', async (req, res, next) => {
    try {

    } catch (err) {
        next(err);
    }
});

// Unhappy with this code. There must be a way to find, update and return a subdocument within an array in Mongoose itself. None of the approaches I tried that involved only Mongoose queries worked, so I had to resort to plain JS array methods to get the job done (inefficiently). I'm facing essentially the same issue in the put request below.
router.get('/:id/review', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header };
        res.set(headers);
        if (header === '') {
            res.status(401);
            throw new Error('Unauthorized user');
        }
        const ratingAndReviewEntry = await RatingsAndReviews.find({ productRef: req.params.id });
        const reviewArray = ratingAndReviewEntry[0].ratingsAndReviews;
        const userReview = reviewArray.find(entry => entry.username === header);
        console.log(userReview);
        res.status(200).json(userReview);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/review', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
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
        await RatingsAndReviews.updateOne({
            productRef: req.params.id
        }, {
            $push: {
                ratingsAndReviews: userRating
            }
        });
        res.status(201).json({ message: 'Rating and review entry added'});
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
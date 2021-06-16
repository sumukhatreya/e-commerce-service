const mongoose = require('mongoose');

const arraySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String
    },
    lastUpdated: {
        type: Date,
        required: true
    }
});

const ratingAndReviewSchema = new mongoose.Schema({
    productRef: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    ratingsAggregate: {
        type: Number,
        required: true,
        default: 0
    },
    numOfRatings: {
        type: Number,
        required: true,
        default: 0
    },
    ratingsAndReviews: [arraySchema]
});

const RatingsAndReviews = mongoose.model('ratingAndReview', ratingAndReviewSchema);

module.exports = RatingsAndReviews;


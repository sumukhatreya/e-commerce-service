const mongoose = require('mongoose');

const ratingAndReviewSchema = new mongoose.Schema({
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
    ratingsAndReviews: [
        {
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
        }
    ]
});

const RatingsAndReviews = mongoose.model('ratingAndReview', ratingAndReviewSchema);

module.exports = RatingsAndReviews;


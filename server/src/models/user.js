const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    shipping_address: {
        type: String
    },
});

const User = mongoose.model('user', userSchema);
module.exports = User;



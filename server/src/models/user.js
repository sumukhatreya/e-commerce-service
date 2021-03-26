const mongoose = require('mongoose');
const { hashPassword } = require('../utils');

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
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    shippingAddress: {
        type: String
    },
});

userSchema.pre('save', async function (next) {
    try {
        console.log('User about to be saved to db', this);
        this.username = this.username.trim();
        this.password = await hashPassword(this.password);
        next();
    } catch (err) {
        next(err);
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;



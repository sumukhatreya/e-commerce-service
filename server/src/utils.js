// Utility functions
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async (userPassword) => {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(userPassword, salt);
    return password;
}

const createJWT = (userId, expiration) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: expiration });
}

module.exports = {
    hashPassword,
    createJWT
}
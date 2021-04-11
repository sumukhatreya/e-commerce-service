// Utility functions
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// class AuthError extends Error{};

const hashPassword = async (userPassword) => {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(userPassword, salt);
    return password;
}

const createJWT = (userId, expiration) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: expiration });
}

const verifyJWT = (req) => {
    const isAuth = true;
    const token = req.cookies.jwt;
    try {
        if (token) {
            const res = jwt.verify(token, process.env.SECRET_KEY); // unsure if this line of code will work as intended.
        } else {
            throw new Error('Token not found');
        }
        return isAuth;
    } catch (err) {
        return !isAuth;
    }
}

module.exports = {
    hashPassword,
    createJWT,
    verifyJWT
}
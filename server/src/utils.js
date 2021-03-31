// Utility functions
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
class AuthError extends Error{};

const hashPassword = async (userPassword) => {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(userPassword, salt);
    return password;
}

const createJWT = (userId, expiration) => {
    return jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: expiration });
}

// Custom middleware to verify JWT.
const verifyJWT = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
                if (err) {
                    throw err;
                } else {
                    console.log(decodedToken);
                    next();
                }
            });
        } else {
            throw new AuthError('JWT does not exist.');
        }
    } catch (err) {
        res.status(401);
        next(err);
    }
}

module.exports = {
    hashPassword,
    createJWT,
    verifyJWT
}
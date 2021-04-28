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
    const token = req.cookies.jwt;
    try {
        if (token) {
            const res = jwt.verify(token, process.env.SECRET_KEY); // unsure if this line of code will work as intended - I hope this throws an error that will be caught in the catch block if the jwt is invalid.
            console.log('Verified payload', res);
            console.log('Payload', res.userId, 'Payload type', typeof res.userId);
            return res.userId;
        } else {
            throw new Error('Token not found');
        }
    } catch (err) {
        return '';
    }
}

module.exports = {
    hashPassword,
    createJWT,
    verifyJWT
}
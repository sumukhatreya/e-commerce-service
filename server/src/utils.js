const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Function that takes a plaintext password as input, hashes it and returns the hashed password.
const hashPassword = async (userPassword) => {
    const salt = await bcrypt.genSalt();
    const password = await bcrypt.hash(userPassword, salt);
    return password;
}

// Function that creates and returns a json web token using the username, secret key (stored in the .env file), and token expiration time as inputs.
const createJWT = (username, expiration) => {
    return jwt.sign({ username }, process.env.SECRET_KEY, { expiresIn : expiration });
}

// Function that takes as input a reference to the request object and returns the JWT payload (username in this case) if the token is valid, and an empty string if invalid.
const verifyJWT = (req) => {
    const token = req.cookies.jwt;
    try {
        if (token) {
            const res = jwt.verify(token, process.env.SECRET_KEY); // unsure if this line of code will work as intended - I hope this throws an error that will be caught in the catch block if the jwt is invalid (the documentation says it does, but not sure how to test this).
            console.log('Verified payload', res);
            console.log('Payload', res.username, 'Payload type', typeof res.username);
            return res.username;
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
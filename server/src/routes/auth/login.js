const { Router } = require('express');
const UserEntry = require('../../models/user');
const { createJWT, verifyJWT } = require('../../utils');
const bcrypt = require('bcrypt');
class AuthError extends Error{};

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        console.log('Req body', req.body);
        if (Object.keys(req.body).length === 0) {
            console.log('im here');
            const isLoggedIn = verifyJWT(req);
            const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn',
                              'isLoggedIn': isLoggedIn };
            console.log('Is user auth', isLoggedIn);
            res.set(headers);
            res.status(200).json({ message: 'Login status' });
        } else {
            const user = await UserEntry.findOne({ username: req.body.username });
            if (user && await bcrypt.compare(req.body.password, user.password)) {
                const token = createJWT(user.username, '23h');
                res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
                res.status(200).json({ message: 'Login successful' });
            } else {
                throw new AuthError('Invalid credentials');
            }
        }
    } catch (err) {
        if (err instanceof AuthError) {
            res.status(401);
        }
        next(err);
    }
});

module.exports = router;
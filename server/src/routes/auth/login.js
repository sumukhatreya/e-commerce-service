const { Router } = require('express');
const UserEntry = require('../../models/user');
const { createJWT } = require('../../utils');
const bcrypt = require('bcrypt');
class AuthError extends Error{};

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const user = await UserEntry.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = createJWT(user._id, '23h');
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
            res.status(200).json({ message: 'Login successful' });
        } else {
            throw new AuthError('Invalid credentials');
        }
    } catch (err) {
        if (err instanceof AuthError) {
            res.status(401);
        }
        next(err);
    }
});

module.exports = router;
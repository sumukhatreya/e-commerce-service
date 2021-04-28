const { Router } = require('express');
const UserEntry = require('../../models/user');
const { createJWT, verifyJWT } = require('../../utils');
const bcrypt = require('bcrypt');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const header = verifyJWT(req);
        const headers = {'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': header};
        res.set(headers);
        res.status(200).json({ message: 'Page loaded' });
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const user = await UserEntry.findOne({ username: req.body.username });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            const token = createJWT(user.username, '23h');
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401);
            throw new Error('Invalid credentials');
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
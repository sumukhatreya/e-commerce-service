const { Router } = require('express');
const UserEntry = require('../../models/user');
class AuthorizationError extends Error{};

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        console.log(req.body, username, password);
        const userEntry = await UserEntry.findOne({ username: username});
        console.log(userEntry);
        if (userEntry && userEntry.password === password) {
            res.status(200).json({message: 'Login successful!'});
        } else {
            throw new AuthorizationError('Invalid credentials. Login unsuccessful.');
        }
    } catch (err) {
        if (err instanceof AuthorizationError) {
            res.status(401);
        }
        next(err);
    }
});

module.exports = router;
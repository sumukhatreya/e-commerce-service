const { Router} = require('express');
const UserEntry = require('../../models/user');
const Cart = require('../../models/cart');
const { createJWT, verifyJWT } = require('../../utils');

const router = Router();

router.post('/' , async (req, res, next) => {
    try {

        // console.log(req.body);
        if (req.body.validate) {
            // console.log(req.body.username);
            const entry = await UserEntry.findOne({ username: req.body.username });
            // console.log(entry);
            if (entry) {
                res.status(409);
                throw new Error('Username already in use');
            } else {
                res.status(202).json({message: 'Username not in use'});
            }
        } else {
            console.log('Im in the register route');
            const userEntry = new UserEntry(req.body);
            const cartEntry = new Cart(req.body);
            await cartEntry.save();
            const createdEntry = await userEntry.save();
            const token = createJWT(createdEntry.username, '23h');
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
            res.status(201).json({ message: 'Account created' });
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
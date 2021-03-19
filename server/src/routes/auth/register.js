const { Router} = require('express');
// const User = require('../../models/user');
const UserEntry = require('../../models/user');

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        if (req.body.validate) {
            // console.log(req.body.username);
            const entry = await UserEntry.findOne({ username: req.body.username});
            // console.log(entry);
            if (entry) {
                res.status(409);
                throw new Error('Username already in use');
            } else {
                res.status(202).json({message: 'Username not in use'});
            }
        } else {
            const userEntry = new UserEntry(req.body);
            const createdEntry = await userEntry.save();
            res.status(201).json(createdEntry);
        }
    } catch (err) {
        next(err);
    }
});

module.exports = router;
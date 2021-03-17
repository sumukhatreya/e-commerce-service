const { Router} = require('express');
const UserEntry = require('../../models/user');

const router = Router();

router.post('/', async (req, res, next) => {
    try {
        const userEntry = new UserEntry(req.body);
        const createdEntry = await userEntry.save();
        res.status(201).json(createdEntry);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
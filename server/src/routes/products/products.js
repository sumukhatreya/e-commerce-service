const { Router } = require('express');
const ProductEntry = require('../../models/product'); 
const { verifyJWT } = require('../../utils');

const router = Router();

router.get('/', async (req, res, next) => {
    try {
        const isLoggedIn = verifyJWT(req);
        const headers = { 'Access-Control-Expose-Headers': 'isLoggedIn', 'isLoggedIn': isLoggedIn };
        res.set(headers);
        const productEntries = await ProductEntry.find({ available: true }, 'image title price rating')
                                                 .sort({ createdAt: -1 });
        res.status(200).json(productEntries);
    } catch (err) {
        next(err);
    }
});






module.exports = router;
const { Router} = require('express');
const app = require('../../app');

const router = Router();

router.get('/', (req, res) => {

});

router.post('/', (req, res) => {
    res.status(201);
    res.json({
        message: 'Registration post request.'
    });
});

module.exports = router;
const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {

});

router.post('/', (req, res) => {
    res.json({
        message: 'Login post request.'
    });
});

module.exports = router;
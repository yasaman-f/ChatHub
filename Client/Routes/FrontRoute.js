const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Auth', req.query);
});

router.get('/OTP', (req, res) => {
    res.render('OTP', req.query);
});

module.exports = {
    EJSRoutes: router
}
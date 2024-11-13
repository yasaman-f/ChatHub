const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('Auth', req.query);
});

router.get('/OTP', (req, res) => {
    res.render('OTP', req.query);
});

router.get('/proword', (req, res) => {
    res.render('Password', req.query);
});

router.get('/chatHub', (req, res) => {
    res.render('Chat', req.query);
});

module.exports = {
    EJSRoutes: router
}
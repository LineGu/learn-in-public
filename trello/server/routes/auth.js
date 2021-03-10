const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.js');

const { tryLocalLoginProcess, trySocialLoginProcess, tryLogout } = authController;

router.post('/login', tryLocalLoginProcess);

router.post('/socialLogin', trySocialLoginProcess);

router.get('/logout', tryLogout);

module.exports = router;

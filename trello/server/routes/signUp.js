const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signUp.js');

const { signUp, checkOverlapOfId } = signUpController;

router.post('/', signUp);

router.post('/OverlappingId', checkOverlapOfId);

module.exports = router;

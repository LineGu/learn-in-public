const express = require('express');
const router = express.Router();
const userDataController = require('../../controllers/user.js');

const { getUserData, getUserEmail, getUserId } = userDataController;

router.get('/', getUserData);

router.post('/email', getUserEmail);

router.post('/id', getUserId);

module.exports = router;

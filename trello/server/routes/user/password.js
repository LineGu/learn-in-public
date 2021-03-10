const express = require('express');
const router = express.Router();
const passwordController = require('../../controllers/password.js');

const { changePassword } = passwordController;

router.route('/').patch(changePassword);

module.exports = router;

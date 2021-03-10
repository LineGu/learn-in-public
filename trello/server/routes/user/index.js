const express = require('express');
const router = express.Router();

const userRouter = require('./user');
const containerRouter = require('./container');
const cardRouter = require('./card');
const containerIndexRouter = require('./containerIndex');
const cardIndexRouter = require('./cardIndex');
const passwordRouter = require('./password');

router.use('/', userRouter);
router.use('/container', containerRouter);
router.use('/card', cardRouter);
router.use('/container/index', containerIndexRouter);
router.use('/card/index', cardIndexRouter);
router.use('/password', passwordRouter);

module.exports = router;

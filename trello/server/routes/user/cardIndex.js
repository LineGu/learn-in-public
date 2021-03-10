const express = require('express');
const router = express.Router();
const cardIndexController = require('../../controllers/cardIndex.js');

const { changeCardIndex } = cardIndexController;

router.route('/:idOfContainer/:idOfCard').patch(changeCardIndex);

module.exports = router;

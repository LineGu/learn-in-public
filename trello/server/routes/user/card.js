const express = require('express');
const router = express.Router();
const cardController = require('../../controllers/card.js');

const { getCardData, deleteCardData, createCardData, modifyCardData } = cardController;

router
  .route('/:containerId/:cardId')
  .get(getCardData)
  .delete(deleteCardData)
  .post(createCardData)
  .patch(modifyCardData);

module.exports = router;

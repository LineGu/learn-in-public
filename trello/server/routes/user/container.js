const express = require('express');
const router = express.Router();
const containerController = require('../../controllers/container.js');

const {
  getContainerData,
  deleteContainerData,
  createContainerData,
  modifyContainerData,
} = containerController;

router
  .route('/:id')

  .get(getContainerData)

  .delete(deleteContainerData)

  .post(createContainerData)

  .patch(modifyContainerData);

module.exports = router;

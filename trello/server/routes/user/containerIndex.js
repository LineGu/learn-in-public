const express = require('express');
const router = express.Router();
const containerIndexController = require('../../controllers/containerIndex.js');

const { changeContainerIndex } = containerIndexController;

router.route(`/:idOfContainerMoved`).patch(changeContainerIndex);

module.exports = router;

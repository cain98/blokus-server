const express = require('express');
const controller = require('../../controllers/room.controller');

const router = express.Router();

router.get('/create', controller.create);
router.get('/join/:id', controller.join);
router.get('/get/:id', controller.get);

module.exports = router;

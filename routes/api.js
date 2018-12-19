'use strict';

const Express = require('express');
const router = Express.Router();
const mobileNumberController = require('../controllers/mobile-number-controller');
const mobileEventController = require('../controllers/mobile-event-controller');

router.use('/number', mobileNumberController);
router.use('/event', mobileEventController);

module.exports = router;

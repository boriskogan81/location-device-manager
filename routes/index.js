'use strict';

const Express = require('express');
const router = Express.Router();


router.use('/api', require('./api'));

module.exports = router;
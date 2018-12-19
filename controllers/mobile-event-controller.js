'use strict';

const express = require('express');
const Number = require('../models/mobile_number').model;
const Task = require('../models/task').model;
const securityConfig = require('../config/security_config');
const ipFilter = require('express-ipfilter').IpFilter;
const frontGateIps = securityConfig.frontgateIps;
const logger = require('../bootstrap/winston');
const Nexmo = require('nexmo');
const nexmoConfig = require('../config/nexmo_config');
const nexmo = new Nexmo({
    apiKey: nexmoConfig.api_key,
    apiSecret: nexmoConfig.api_secret
});

const router = express.Router();

router.post('/ping', ipFilter(frontGateIps, {mode: 'allow'}), async (req, res) => {
    try {
        const {number} = req.body;
        await new Number
            .where({
                'number': number
            })
            .upsert({
                'number': number
            });
        logger.info(`Ping attempt for number ${number}`);
        nexmo.message.sendSms(nexmoConfig.from_number, number, "DW");
        logger.info(`Ping attempt for number ${number} successful`);
        return ReS(res, {result: 'success'})
    }
    catch (e) {
        logger.error(`Ping attempt for number ${number} failed with error ${e}`);
        return ReE(res, e, 500);
    }
});


module.exports = router;
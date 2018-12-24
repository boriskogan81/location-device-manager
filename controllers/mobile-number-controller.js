'use strict';

const express = require('express');
const Number = require('../models/mobile_number').model;
const Event = require('../models/mobile_event').model;
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

router.post('/webhooks/inbound-sms', ipFilter(frontGateIps, {mode: 'allow'}), async (req, res) => {
    try {
        logger.info(`Incoming event for number ${req.body.msisdn}: ${JSON.stringify(req.body)}`);
        await new Event()
            .save({
                'details': req.body,
                'created': new Date(),
                'mobile_number_id': req.body.msisdn
            });
        return ReS(res, {result: 'success'})
    }
    catch (e) {
        logger.error(`Incoming event for number ${req.body.msisdn} failed with error ${e}`);
        return ReE(res, e, 500);
    }
});

module.exports = router;
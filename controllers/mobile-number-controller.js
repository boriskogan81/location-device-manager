'use strict';

const express = require('express');
const Event = require('../models/mobile_event').model;
const Task = require('../models/task').model;
const logger = require('../bootstrap/winston');
const requestAsync = require('request-promise-native');
const azimuthUrl = require('../config/services').azimuth_url;
const router = express.Router();

router.post('/webhooks/inbound-sms', async (req, res) => {
    try {
        logger.info(`Incoming event for number ${req.body.msisdn}: ${JSON.stringify(req.body)}`);
        await new Event()
            .save({
                'event': req.body,
                'created': new Date(),
                'mobile_number_id': req.body.msisdn
            });

        const task = await new Task()
            .where({'mobile_number_id': req.body.msisdn})
            .fetch();

        if (task && task.serialize() && task.serialize().id) {
            let taskDetails = task.serialize().details;
            taskDetails.ping_pending = false;
            await new Task()
                .where({'mobile_number_id': req.body.msisdn})
                .upsert({'details': taskDetails});
        }

        const options = {
            method: 'POST',
            url: `${azimuthUrl}/session/event`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                event: req.body
            },
            json: true,
            resolveWithFullResponse: true
        };

        await requestAsync(options);

        return ReS(res, {result: 'success'});
    }
    catch (e) {
        logger.error(`Incoming event for number ${req.body.msisdn} failed with error ${e}`);
        return ReE(res, e, 500);
    }
});

module.exports = router;
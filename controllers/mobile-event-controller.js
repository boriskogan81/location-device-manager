'use strict';

const express = require('express');
const Number = require('../models/mobile_number').model;
const Event = require('../models/mobile_event').model;
const Task = require('../models/task').model;
const logger = require('../bootstrap/winston');
const moment = require('moment');
const Nexmo = require('nexmo');
const nexmoConfig = require('../config/nexmo_config');
const nexmo = new Nexmo({
    apiKey: nexmoConfig.api_key,
    apiSecret: nexmoConfig.api_secret
});

const router = express.Router();

router.post('/ping',  async (req, res) => {
    try {
        const {number, message} = req.body;
        await new Number()
            .where({
                'number': number
            })
            .upsert({
                'number': number
            });
        logger.info(`Ping attempt for number ${number}`);
        nexmo.message.sendSms(nexmoConfig.from_number, number, message);
        logger.info(`Ping attempt for number ${number} successful`);
        return ReS(res, {result: 'success'});
    }
    catch (e) {
        logger.error(`Ping attempt for number ${number} failed with error ${e}`);
        return ReE(res, e, 500);
    }
});

router.post('/task', async (req, res) => {
    try {
        const {number, message, frequency_minutes, duration_hours, max_pings} = req.body;
        if (!(number && message && parseInt(frequency_minutes) && parseInt(duration_hours) && parseInt(max_pings)))
            return ReE(res, 'Could not create task, malformed request', 422);

        await new Number()
            .where({
                'number': number
            })
            .upsert({
                'number': number
            });

        const created = new Date();
        const expires = new Date(new Date().setHours(new Date().getHours() + parseInt(duration_hours)));

        await new Task()
            .where({'mobile_number_id': number})
            .upsert({
                'details': {
                    frequency_minutes, max_pings, current_pings: 0
                },
                created,
                expires,
                'mobile_number_id': number
            });

        const task = await new Task()
            .where({'mobile_number_id': number})
            .fetch();
        const taskId = task.serialize().id;

        (async function pingNumber(){
            const fetchedTask = await new Task()
                .where({'id': taskId})
                .fetch();

            const task = fetchedTask.serialize();
            let taskDetails = task.details;

            if (taskDetails.ping_pending) {
                logger.info('Last ping for task is still pending, will not ping until the next interval', task);
                setTimeout(pingNumber, frequency_minutes * 1000 * 60);
                return;
            }

            if (taskDetails.current_pings >= taskDetails.max_pings) {
                logger.info('Max pings reached, clearing task interval', task);
                return;
            }

            const now = new Date();
            const expires = new Date(task.expires);
            if (now > expires) {
                logger.info('Task is expired,', task);
                return;
            }

            nexmo.message.sendSms(nexmoConfig.from_number, number, message);
            taskDetails.ping_pending = true;
            taskDetails.current_pings++;
            await new Task()
                .where({'id': taskId})
                .upsert({'details': taskDetails});
            setTimeout(pingNumber, frequency_minutes * 1000 * 60);
        })();
        ReS(res, {result: 'success'});
    }
    catch (e) {
        logger.error(`Task attempt failed with error ${e}`, {body: req.body});
        return ReE(res, e, 500);
    }
});

router.get('/events',  async (req, res) => {
    try {
        logger.info(`Events get attempt with params`, {params: req.params});
        let {number, from, to} = req.params;
        if(!from || !moment(new Date(from)))
            from = new Date();
        if(!to || !moment(new Date(to)))
            to = moment().subtract(1, 'w').toDate();

        const events = await new Event()
            .query((qb) => {
                qb
                    .whereBetween('created', [from, to])
                    .andWhere({'mobile_number_id': number});
            })
            .fetch();
        logger.info(`Events get attempt successful`, {events});
        return ReS(res, {events}, 200);
    }
    catch (e) {
        logger.error(`Events get attempt failed with error ${e}`);
        return ReE(res, e, 500);
    }
});
module.exports = router;
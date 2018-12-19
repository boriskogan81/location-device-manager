'use strict';

// This is useful for relative paths to root
global.__base = __dirname + '/';

require('./global_functions');
const express = require('express');
const bodyParser = require('body-parser');
const httpConfig = require('./config/http');
const logger = require('./bootstrap/winston');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/', require('./routes/index'));

app
    .listen(httpConfig.port, httpConfig.host, (error) => {
        if (error) {
            console.error(error);
            return process.exit(1);
        }
        logger.info(`Location device manager API running on ${httpConfig.host}:${httpConfig.port}`);
    });


module.exports = app;
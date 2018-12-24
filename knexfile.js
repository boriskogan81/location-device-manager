const dbConfig = require('./config/db_config');
dbConfig.test.pool['idleTimeoutMillis']= Infinity;
let config;
if(process.env.NODE_ENV === 'test')
    config = dbConfig.test;
else
    config = dbConfig.production;
module.exports = config;

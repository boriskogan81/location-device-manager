const dbConfig = require('./config/db_config');
dbConfig.test.pool['idleTimeoutMillis']= Infinity;

module.exports = {
    production: dbConfig.production,
    test: dbConfig.test
};

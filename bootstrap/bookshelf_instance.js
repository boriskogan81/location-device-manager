'use strict';
const env = process.env.NODE_ENV;

let dbConfig;

if (env === 'test')
    dbConfig = require('../config/db_config')['test'];
else{
    dbConfig = require('../config/db_config')['production'];
    if(process.env.SQL_USER)
        dbConfig.user = process.env.SQL_USER;
    if(process.env.SQL_DATABASE)
        dbConfig.database = process.env.SQL_DATABASE;
    if(process.env.SQL_PASSWORD)
        dbConfig.password = process.env.SQL_PASSWORD;
    if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production')
        dbConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}


if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
    dbConfig.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}
const knex = require('knex')(dbConfig);
const jsonColumns = require('bookshelf-json-columns');
const upsert = require('bookshelf-upsert');

const bookshelf = require('bookshelf')(knex);
bookshelf.plugin(jsonColumns);
bookshelf.plugin(upsert);
bookshelf.plugin('pagination');
bookshelf.plugin('registry');

module.exports.bookshelf = bookshelf;
module.exports.knex = knex;
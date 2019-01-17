'use strict';
const env = process.env.NODE_ENV;

let dbConfig;

if (env === 'test')
    dbConfig = require('../config/db_config')['test'];
else
    dbConfig = require('../config/db_config')['production'];

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
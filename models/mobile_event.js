'use strict';
const bookshelf = require('../bootstrap/bookshelf_instance').bookshelf;

const MobileEvent = bookshelf.Model.extend({
        tableName: 'mobile_event'
    },
    {
        jsonColumns: ['event']
    }
);

module.exports.model = MobileEvent;
'use strict';

const bookshelf = require('../bootstrap/bookshelf_instance');
const MobileEvent = require('./mobile_event').model;

const MobileNumber = bookshelf.Model.extend({
        tableName: 'mobile_number',
        events () {
            return this.hasMany(MobileEvent);
        }
    }
);

module.exports.model = MobileNumber;
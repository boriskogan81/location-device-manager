'use strict';
const bookshelf = require('../bootstrap/bookshelf_instance');

const Task = bookshelf.Model.extend({
        tableName: 'task'
    },
    {
        jsonColumns: ['details']
    }
);

module.exports.model = Task;
'use strict';
exports.up = async function (knex) {
    try{
        const hasMobileNumber = await knex
            .schema
            .hasTable('mobile_number');

        if (!hasMobileNumber)
            await knex
                .schema
                .createTable('mobile_number', table => {
                    table.increments('id').primary().unsigned();
                    table.string('number');
                });

        const hasMobileEvent = await knex
            .schema
            .hasTable('mobile_event');

        if (!hasMobileEvent)
            await knex
                .schema
                .createTable('mobile_event', table => {
                    table.increments('id').primary().unsigned();
                    table.json('event');
                    table.dateTime('created');
                    table.integer('mobile_number_id').unsigned().notNullable();
                    table.foreign('mobile_number_id').references('mobile_number.id')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                });

        const hasTask = await knex
            .schema
            .hasTable('task');

        if (!hasTask)
            await knex
                .schema
                .createTable('task', table => {
                    table.increments('id').primary().unsigned();
                    table.json('details');
                    table.dateTime('created');
                    table.dateTime('expires');
                    table.integer('mobile_number_id').unsigned().notNullable();
                    table.foreign('mobile_number_id').references('mobile_number.id')
                        .onDelete('CASCADE')
                        .onUpdate('CASCADE');
                });
    }
    catch (e) {
        console.log('knex migrations failed with error ', e);
    }
};

exports.down = async function (knex) {
    await knex.schema
        .dropTable('mobile_event')
        .dropTable('task')
        .dropTable('mobile_number')
};
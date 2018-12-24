process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const app = require('../app');
const knex = require('../bootstrap/bookshelf_instance').knex;
const request = require('supertest');

const pingBody = {
    number : '12345'
};

before(async function (done) {
    await knex.migrate.latest();
    done();
});

describe('/POST /api/event/ping', function() {
    it('should return a 200 response if we pass proper registration credentials',
        function (done){
            request(app)
                .post('/api/event/ping')
                .send(pingBody)
                .expect(200, done)
        });
});

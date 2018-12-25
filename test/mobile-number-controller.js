process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const app = require('../app');
const knex = require('../bootstrap/bookshelf_instance').knex;
const request = require('supertest');

const inboundSMS = {
    "msisdn": "447700900001",
    "to": "447700900000",
    "messageId": "0A0000000123ABCD1",
    "text": "Hello world",
    "type": "text",
    "keyword": "Hello",
    "message-timestamp": "2020-01-01T12:00:00.000+00:00",
    "timestamp": "1578787200",
    "nonce": "aaaaaaaa-bbbb-cccc-dddd-0123456789ab",
    "concat": "true",
    "concat-ref": "1",
    "concat-total": "3",
    "concat-part": "2",
    "data": "abc123",
    "udh": "abc123"
};

before(async function (done) {
    await knex.migrate.latest();
    done();
});

describe('/POST /api/number/webhooks/inbound-sms', function() {
    it('should return a 200 response if we post a proper sms',
        function (done){
            request(app)
                .post('/api/number/webhooks/inbound-sms')
                .send(inboundSMS)
                .expect(200, done)
        });
});

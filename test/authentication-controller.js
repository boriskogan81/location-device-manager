process.env.NODE_ENV = 'test';
const expect = require('chai').expect;
const app = require('../app');
const knex = require('../bootstrap/bookshelf_instance').knex;
const request = require('supertest');

const registerCredentials = {
    username: 'Test',
    password: 'Pass1234',
    password_confirm: 'Pass1234',
    email: 'test@test.com',
    first_name: 'TestFirstName',
    last_name: 'TestLastName',
};

const loginCredentials = {
    username: 'Test',
    password: 'Pass1234',
};

let testToken;


before(async function (done) {
    await knex.migrate.latest();
    done();
});

describe('/POST /api/authentication/register', function() {
    it('should return a 200 response if we pass proper registration credentials',
        function (done){
            request(app)
                .post('/api/authentication/register')
                .send(registerCredentials)
                .expect(200, done)
        });
});

describe('/POST /api/authentication/login', function() {
    it('should return a 200 response if we pass proper login credentials',
        function (done){
            request(app)
                .post('/api/authentication/login')
                .send(loginCredentials)
                .end(function(err, response){
                    expect(response.statusCode).to.equal(200);
                    testToken = response.body.token;
                    done()
            });
        });
});

describe('/POST /api/authentication/authenticate', function() {
    it('should return a 200 response if we pass a proper token',
        function (done){
            request(app)
                .post('/api/authentication/authenticate')
                .send({token: testToken})
                .expect(200, done)
        });
});

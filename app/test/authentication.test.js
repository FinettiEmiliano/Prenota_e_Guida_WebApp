const request = require('supertest');
const server = require('../../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

beforeAll( async () => { jest.setTimeout(20000);
    server.db = await mongoose.connect(process.env.DB_URL); });
afterAll( () => { mongoose.connection.close(true); });

//check if username is associated whit a non existent user
test('POST /api/v1/authenticationToken - non existent user', () => {
    return request(server)
    .post('/api/v1/authenticationToken')
    .set('Content-type', 'application/json')
    .send({ username: 'AVirgiliano', password: 'admin'})
    .expect(404)
    .expect((res) => {
        res.body.success = false,
        res.body.message = 'Authentication failed. User not found.'
    })
        
}); 

//check if the password is incorrect
test('POST /api/v1/authenticationToken - incorrect password', () => {
    return request(server)
    .post('/api/v1/authenticationToken')
    .set('Content-type', 'application/json')
    .send({ username: 'AVirgiliana', password: 'qwerty'})
    .expect(400)
    .expect((res) => {
        res.body.success = false,
        res.body.message = 'Authentication failed. Wrong password.'
    })
        
}); 

//check if credentials are correct
test('POST /api/v1/authenticationToken - correct username and password', () => {
    return request(server)
    .post('/api/v1/authenticationToken')
    .set('Content-type', 'application/json')
    .send({ username: 'AVirgiliana', password: 'admin'})
    .expect(200)
    .expect((res) => {
        res.body.success = true,
        res.body.message = 'Enjoy your token!',
        res.body.token = String,
        res.body.id = '628e4bb2f23d519a0b744d9c',
        res.body.user_type = 'Amministratore',
        res.body.username = 'AVirgiliana',
        res.body.name = 'A',
        res.body.surname = 'Virgiliana',
        res.body.self = 'api/v1/authenticationToken/628e4bb2f23d519a0b744d9c'
    })
        
}); 


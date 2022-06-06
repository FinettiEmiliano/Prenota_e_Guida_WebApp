const request = require('supertest');
const server = require('../../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const { ObjectId } = require('bson');

beforeAll( async () => { jest.setTimeout(20000);
    server.db = await mongoose.connect(process.env.DB_URL); });
afterAll( () => { mongoose.connection.close(true); });

var token = jwt.sign( {username: 'AVirgiliana', id: '628e4bb2f23d519a0b744d9c'},
    process.env.SUPER_SECRET, {expiresIn: 86400} ); // create a valid tokens

//check if there aren't any user in the database
test('GET /api/v1/users - DB with no users', async () => {

    await User.deleteMany({user_type: 'Studente'});
    await User.deleteMany({user_type: 'Istruttore'});

    return request(server)
    .get('/api/v1/users' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(204)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'There are no Users';
    })
});

//check DB without students
test('GET /api/v1/users/students - DB without students', async () => {
    
    await User.deleteMany({user_type: 'Studente'});

    return request(server)
    .get('/api/v1/users/students' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(204)
    .expect((res) => {
        res.body.success = false;
        res.body.message == 'There are no Students.';
    })
});

//check DB without instructors
test('GET /api/v1/users/instructors - DB without instructors', async () => {

    await User.deleteMany({user_type: 'Istruttore'});

    return request(server)
    .get('/api/v1/users/instructors' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(204)
    .expect((res) => {
        res.body.success = false;
        res.body.message == 'There are no Instructors.';
    })
});

//check DB with users
test('GET /api/v1/users - DB with users', async () => {

    await new User({
        name: 'Studente',
        surname: 'Prova',
        user_type: 'Studente',
        username: 'StudenteProva0',
        password: 'njids',
        photo: 'foto.jpg'
    }).save();

    await new User({
        name: 'Istruttore',
        surname: 'Prova',
        user_type: 'Istruttore',
        username: 'IstruttoreProva0',
        password: 'vdsvd',
        photo: 'foto.jpg'
    }).save();

    return request(server)
    .get('/api/v1/users' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'OK';
        res.body.users = [];
    })
            
});

//check DB with students
test('GET /api/v1/users/students - DB with students', async () => {

    await new User({
        name: 'Studente',
        surname: 'Prova',
        user_type: 'Studente',
        username: 'StudenteProva0',
        password: 'fewd',
        photo: 'foto.jpg'
    }).save();

    return request(server)
    .get('/api/v1/users/students' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message == 'OK';
        res.body.users = [];
    })
});

//check DB with instructors
test('GET /api/v1/users/instructors - DB with instructors', async () => {

    await new User({
        name: 'Istruttore',
        surname: 'Prova',
        user_type: 'Istruttore',
        username: 'IstruttoreProva1',
        password: 'fsqs',
        photo: 'foto.jpg'
    }).save();

    return request(server)
    .get('/api/v1/users/instructors' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message == 'OK';
        res.body.users = [];
    })
});

//check if there isn't name request
test('POST /api/v1/users - no name', () => {
    return request(server)
    .post('/api/v1/users')
    .set('Content-type', 'application/json')
    .send({ 
        'token' : token,
        'name': '',
        'surname': 'Bennati',
        'user_type' : 'Studente',
        'photo': 'foto.jpg'
    })
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'Name, surname or user_type undefined.';
    })       
});

//check if there isn't surname request
test('POST /api/v1/users - no surname', () => {
    return request(server)
    .post('/api/v1/users')
    .set('Content-type', 'application/json')
    .send({ 
        'token' : token,
        'name': 'Jacopo',
        'surname': '',
        'user_type' : 'Studente',
        'photo': 'foto.jpg'
    })
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'Name, surname or user_type undefined.';
    })    
});

//check if there isn't user_type request
test('POST /api/v1/users - no user_type', () => {
    return request(server)
    .post('/api/v1/users')
    .set('Content-type', 'application/json')
    .send({ 
        'token' : token,
        'name': 'Jacopo',
        'surname': 'Bennati',
        'user_type' : '',
        'photo': 'foto.jpg'
    })
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'Name, surname or user_type undefined.';
    })    
});

//check if all fileds are correct
test('POST /api/v1/users - all correct', () => {
    return request(server)
    .post('/api/v1/users')
    .set('Content-type', 'application/json')
    .send({ 
        'token' : token,
        'name': 'Jacopo',
        'surname': 'Bennati',
        'user_type' : 'Studente',
        'photo': 'foto.jpg'
    })
    .expect(201)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'User created.';
    })    
});

//check delete a non existent user
test('DELETE /api/v1/users/:id - delete non existent user', () => {
    return request(server)
    .delete('/api/v1/users/728e4ca86f084f37396d2050' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message == 'The user does not exist';
    })
});

//check delete an existent user
test('DELETE /api/v1/users/:id - delete existent user', () => {
    return request(server)
    .delete('/api/v1/users/628e4ca86f084f37396d2050' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(404)
    .expect((res) => {
        res.body.success = true;
        res.body.message == 'Cancellation done';
    })
});

//check find a non existent user
test('GET /api/v1/users/:username - search a non existent user', () => {
    return request(server)
    .get('/api/v1/users/IamNOTaUSER' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'A User with the specified username was not found.';
    })
});

//check find an existent user
test('GET /api/v1/users/:username - search an existent user', () => {
    return request(server)
    .get('/api/v1/users/AVirgiliana' + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'OK';
        res.body.users = [];
    })
});

//check update a non existent user
test('PUT /api/v1/users/:id - update a non existent user', () => {
    return request(server)
    .put('/api/v1/users/' + new ObjectId + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'name': 'Not',
        'surname': 'User',
        'user_type': 'Studente',
        'username': 'NotUser0',
        'changePsw': false,
        'photo': 'foto.jpg'
    })
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'A user with the specified ID was not found.';
    })    
});

//check if there isn't name request
test('PUT /api/v1/users/:id - update no name', async () => {
                
    let student = await User.findOne({ username: "StudenteProva0" });
    let studentID = student._id.toString();
    
    return request(server)
    .put('/api/v1/users/' + studentID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'name': '',
        'surname': 'Bennati',
        'user_type' : 'Studente',
        'username': 'JacopoBennati0',
        'changePsw': false,
        'photo': 'foto.jpg'
    })
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'Name, surname or user_type undefined.';
    })    
});

//check if there isn't surname request
test('PUT /api/v1/users/:id - update no surname', async () => {
            
    let student = await User.findOne({ username: "StudenteProva0" });
    let studentID = student._id.toString();
    
    return request(server)
    .put('/api/v1/users/' + studentID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'name': 'Jacopo',
        'surname': '',
        'user_type' : 'Studente',
        'username': 'JacopoBennati0',
        'changePsw': false,
        'photo': 'foto.jpg'
    })
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'Name, surname or user_type undefined.';
    })    
});

//check if there isn't user_type request
test('PUT /api/v1/users/:id - update no user_type', async () => {
        
    let student = await User.findOne({ username: "StudenteProva0" });
    let studentID = student._id.toString();
    
    return request(server)
    .put('/api/v1/users/' + studentID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'name': 'Jacopo',
        'surname': 'Bennati',
        'user_type' : '',
        'username': 'JacopoBennati0',
        'changePsw': false,
        'photo': 'foto.jpg'
    })
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'Name, surname or user_type undefined.';
    })                              
});

//check if name and surname are same as the previous one
test('PUT /api/v1/users/:id - update name and surname are same as the previous one', async () => {
        
    let student = await User.findOne({ username: "StudenteProva0" });
    let studentID = student._id.toString();
    
    return request(server)
    .put('/api/v1/users/' + studentID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'name': student.name,
        'surname': student.surname,
        'user_type' : student.user_type,
        'username': student.username,
        'changePsw': false,
        'photo': student.photo
    })
    .expect(409)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'User was not updated, name and surname were not changed';
    })                              
});

//check change password
test('PUT /api/v1/users/:id - update only change password', async () => {
    
    let student = await User.findOne({ username: "StudenteProva0" });
    let studentID = student._id.toString();
    
    return request(server)
    .put('/api/v1/users/' + studentID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'name': 'Studente',
        'surname': 'Prova',
        'user_type' : 'Studente',
        'username': 'StudenteProva0',
        'changePsw': true,
        'photo': 'foto.jpg'
    })
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'User updated';
    })                        
});

//check correct update
test('PUT /api/v1/users/:id - update correct user', async () => {
    
    let student = await User.findOne({ username: "StudenteProva0" });
    let studentID = student._id.toString();
    
    return request(server)
    .put('/api/v1/users/' + studentID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'name': 'Giaco',
        'surname': 'Bennatia',
        'user_type' : 'Studente',
        'username': 'JacopoBennati0',
        'changePsw': false,
        'photo': 'foto.jpg'
    })
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'User updated';
    })                  
});


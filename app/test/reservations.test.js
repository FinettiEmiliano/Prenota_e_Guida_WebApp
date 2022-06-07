const request = require('supertest');
const server = require('../../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Workshift = require('../models/availability.model');  // get out availability model
const User = require('../models/user.model');               // get out user model
const Reservation = require('../models/reservation.model'); //get out reserevation model
const { ObjectId } = require('bson');

beforeAll( async () => { jest.setTimeout(25000);
    server.db = await mongoose.connect(process.env.DB_URL); });
afterAll( () => { mongoose.connection.close(true); });

var token = jwt.sign( {username: 'AVirgiliana', id: '628e4bb2f23d519a0b744d9c'},
    process.env.SUPER_SECRET, {expiresIn: 86400} ); // create a valid tokens
    

//insert a reservation for an inexistent user    
test('POST /api/v2/reservations/:id - user does not exist', async () => {

    return request(server)
    .post('/api/v2/availabilities/' + new ObjectId() + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        "slotID": new ObjectId()
    })
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user doesn't exist";
    })   

});
//insert a reservation for an inexistent user (not a student)        
test('POST /api/v2/reservations/:id - user is not a student', async () => {
    
    await new User({'name': 'Marco',
    'surname': 'Brumotti',
    'user_type' : 'Istruttore',
    'username': 'MarcoBrumotti0',
    'photo': 'foto.jpg'}).save();

    let temp = await User.findOne({username: "MarcoBrumotti0"});
    let id = temp._id.toString();
    
    return request(server)
    .post('/api/v2/reservations/' + id + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        "slotID": new ObjectId()
    })
    .expect(403)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user in params isn't a student";
    })   

});
//insert a reservation that does not exist       
test('POST /api/v2/reservations/:id - reservation does not exist', async () => {

    await new User({
        'name': 'Diego',
        'surname': 'Arrondo',
        'user_type' : 'Studente',
        'username': 'DiegoArrondo0',
        'photo': 'foto.jpg'
    }).save();

    let temp =await  User.findOne({username: "DiegoArrondo0"});
    let id = temp._id.toString();

    return request(server)
    .post('/api/v2/reservations/' + id + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        "slotID": new ObjectId()
    })
    .expect(481)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The slotID does not exist in availabilities";
    })   

});
//insert a new reservation                         
test('POST /api/v2/reservations/:id - insert a new reservation', async () => {
    
    //insert a new student
    await new User({
        '_id': new ObjectId(),
        'name': "Luca",
        'surname': "Rossi",
        'username': "LucaRossi0",
        'password': "passwordtest",
        'user_type': 'Studente',
        'photo': "photo.jpeg"
    }).save();
    let temp0 = await User.findOne({username: "LucaRossi0"});
    let idStudent = temp0._id.toString();
    
    //insert instructor for availabilities
    await new User({
        '_id': new ObjectId(),
        'name': "Istruttore",
        'surname': "Test",
        'username': "IstruttoreTest0",
        'password': "passwordtest",
        'user_type': 'Istruttore',
        'photo': "photo.jpeg"
    }).save();
    let temp1 = await User.findOne({username: "IstruttoreTest0"});
    let idIstructor = temp1._id.toString();
    let idTime_slot = new ObjectId();   //if of time_slot in availabilities
    
    //insert a new availabilities
    await new Workshift ({ 
        'date' : {
            'day': 19,
            'month': 12,
            'year': 2022
        },
        'instructor' : idIstructor,
        'start_time' : {
            'hour': 10,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 0
        },
        'duration': 30,
        'time_slots': [
            {   
                '_id': idTime_slot,
                'hour': 10,
                'minute': 30
            }
        ]
    }).save();

    return request(server)
    .post('/api/v2/reservations/' + idStudent + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        "slotID": idTime_slot,
    })
    .expect(201)
    .expect((res) => {
        res.body.success = true;
        res.body.message = "Reservation done";
    })   

});
//insert a reservation aldready made               
test('POST /api/v2/reservations/:id - insert a reservation aldready made', async () => {

    let stud = await User.findOne({user_type: "Studente"});
    idStudent = stud._id;
    
    let idTime_slot = new ObjectId();
    //insert a new availabilities
    await new Workshift ({ 
        'date' : {
            'day': 19,
            'month': 12,
            'year': 2022
        },
        'instructor' : new ObjectId(),
        'student': idStudent,
        'start_time' : {
            'hour': 10,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 0
        },
        'duration': 30,
        'time_slots': [
            {
                '_id': idTime_slot,
                'hour': 10,
                'minute': 30
            }
        ]
    }).save();
    
    let temp = await Workshift.findOne({});
    let dateWork = temp.date;
    let timeWork = temp.time_slots[0];

    await new Reservation({
        'instructor': temp.instructor,
        'student': idStudent,
        'time_slot': {
            'id': idTime_slot,
            'date': dateWork,
            'start_time': timeWork
        }
    }).save();
    
    let idRes = await Reservation.findOne({});
    idRes = idRes.time_slot.id;
    return request(server)
    .post('/api/v2/reservations/' + idStudent + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        "slotID": idTime_slot
    })
    .expect(491)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Reservation already made";
    })   

});
//get all reservations for an inexistent user (not a student)     
test('GET /api/v2/reservations/:id - user does not exist', async () => {

    return request(server)
    .get('/api/v2/reservations/' + new ObjectId() + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user doesn't exist";
    })   

});
//get all reservations of a user (not a student)         
test('GET /api/v2/reservations/:id - user is not a student', async () => {
    
    await new User({'name': 'Marco',
    'surname': 'Brumotti',
    'user_type' : 'Istruttore',
    'username': 'MarcoBrumotti1',
    'photo': 'foto.jpg'}).save();

    let temp = await User.findOne({username: "MarcoBrumotti1"});
    let id = temp._id.toString();
    
    return request(server)
    .post('/api/v2/reservations/' + id + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(403)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user in params isn't a student";
    })   

});
//get all  reservations of a student        
test('GET /api/v2/reservations/:id - user has no reservations', async () => {
    
    await new User({'name': 'Marco',
    'surname': 'Brumotti',
    'user_type' : 'Studente',
    'username': 'MarcoBrumotti2',
    'photo': 'foto.jpg'}).save();

    let temp = await User.findOne({username: "MarcoBrumotti2"});
    let id = temp._id.toString();
    
    return request(server)
    .get('/api/v2/reservations/' + id + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(209)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "There are no reservation of this student";
        res.body.freeReservation = []
    })   

});
//get all reservations of a user (not a student)      
test('GET /api/v2/reservations/:id - user is not a student', async () => {
    
    await new User({'name': 'Marco',
    'surname': 'Brumotti',
    'user_type' : 'Studente',
    'username': 'MarcoBrumotti4',
    'photo': 'foto.jpg'}).save();

    let temp = await User.findOne({username: "MarcoBrumotti4"});
    let id = temp._id.toString();

    await new Reservation({
        'instructor': new ObjectId(),
        'student': id,
        'time_slot': {
            'id': new ObjectId(),
            'date': {
                'day': 25,
                'month': 12,
                'year': 2023
            },
            'start_time': {
                'hour': 16,
                'minute': 30
            }
        }
    }).save();

    return request(server)
    .get('/api/v2/reservations/' + id + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = "OK";
        res.body.freeReservation = []
    })   

});
//delete a reservation 
test('DELETE /api/v2/reservations/:id - delete a reservation ', async () => {
    
    await new Reservation({
        'instructor': new ObjectId(),
        'student': new ObjectId(),
        'time_slot': {
            'id': new ObjectId(),
            'date': {
                'day': 10,
                'month': 12,
                'year': 2023
            },
            'start_time': {
                'hour': 16,
                'minute': 30
            }
        }
    }).save();
    let idRes = await Reservation.findOne({});
    idRes= idRes._id;

    return request(server)
    .delete('/api/v2/reservations/' + idRes+ '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'Cancellation done';
    })
});
//delete an inexistent reservation 
test('DELETE /api/v2/reservations/:id - delete an inexistent reservation ', async () => {

    return request(server)
    .delete('/api/v2/reservations/' + new ObjectId()+ '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'The reservation does not exist';
    })
});

const request = require('supertest');
const server = require('../../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Workshift = require('../models/availability.model'); // get out availability model
const User = require('../models/user.model'); // get out user model
const { ObjectId } = require('bson');

beforeAll( async () => { jest.setTimeout(15000);
    server.db = await mongoose.connect(process.env.DB_URL); });
afterAll( () => { mongoose.connection.close(true); });

var adminID = '628e4bb2f23d519a0b744d9c';
var token = jwt.sign( {username: 'AVirgiliana', id: adminID },
    process.env.SUPER_SECRET, {expiresIn: 86400} ); // create a valid tokens

//check instructor with no availabilities
test('GET /api/v2/availabilities/:id - instructor with no availabilities', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva0' });
    let instructorID = instructor._id.toString();

    await Workshift.deleteMany({ instructor: instructorID });

    return request(server)
    .get('/api/v2/availabilities/' + instructorID + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(209)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'There are no workshifts';
    })
});

//check instructor with availabilities
test('GET /api/v2/availabilities/:id - instructor with availabilities', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva0' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '10',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '9',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    return request(server)
    .get('/api/v2/availabilities/' + instructorID + '?token=' + token)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'OK';
        res.body.workshifts = [];
    })
});

//check if is a non existent instructor
test('POST /api/v2/availabilities - non existent instructor', async () => {

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : new ObjectId,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user doesn't exists";
    })       
});

//check if user isn't an instructor
test('POST /api/v2/availabilities - user is not an instructor', async () => {

    let instructor = await User.findOne({ username: 'StudenteProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(403)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user isn't an instructor";
    })       
});

//check if day is equal to 0 in the request
test('POST /api/v2/availabilities - day = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 0,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if month is equal to 0 in the request
test('POST /api/v2/availabilities - month = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 0,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if year is equal to 0 in the request
test('POST /api/v2/availabilities - year = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 0
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't day request
test('POST /api/v2/availabilities - no day', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': '',
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't month request
test('POST /api/v2/availabilities - no month', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': '',
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't year request
test('POST /api/v2/availabilities - no year', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': ''
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't hour start time request
test('POST /api/v2/availabilities - no hour start time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': '',
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't minute start time request 3.33
test('POST /api/v2/availabilities - no minute start time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': ''
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't hour end time request
test('POST /api/v2/availabilities - no hour end time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': '',
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't minute end time request
test('POST /api/v2/availabilities - no minute end time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': ''
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't instructor request
test('POST /api/v2/availabilities - no instructor',() => {

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : '',
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if duration is equal to 0 in the request
test('POST /api/v2/availabilities - duration = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 0
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't duration request 3.38
test('POST /api/v2/availabilities - no duration', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': ''
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if the shift goes beyond working hours - starts too early
test('POST /api/v2/availabilities - starts too early', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 7,
            'minute': 0
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(409)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Shift goes beyond working hours";
    })       
});

//check if the shift goes beyond working hours - ends too late
test('POST /api/v2/availabilities - ends too late', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 0
        },
        'end_time' : {
            'hour': 20,
            'minute': 30
        },
        'duration': 30
    })
    .expect(409)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Shift goes beyond working hours";
    })       
});

//check if the shift overlaps another shift - starting time in the middle
test('POST /api/v2/availabilities - overlapping - starting time in the middle', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '14',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 14,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 11,
            'minute': 0
        },
        'end_time' : {
            'hour': 11,
            'minute': 0
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check if the shift overlaps another shift - ending time in the middle
test('POST /api/v2/availabilities - overlapping - ending time in the middle', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '13',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 13,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 0
        },
        'end_time' : {
            'hour': 11,
            'minute': 0
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check if the shift overlaps another shift - starting before and ending after
test('POST /api/v2/availabilities - overlapping - starting before and ending after', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '11',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 11,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 0
        },
        'end_time' : {
            'hour': 18,
            'minute': 0
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check if the shift overlaps another shift - same time
test('POST /api/v2/availabilities - overlapping - same time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '12',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 12,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 10,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check correct insert
test('POST /api/v2/availabilities - correct insert', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .post('/api/v2/availabilities?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 15,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 10,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(201)
    .expect((res) => {
        res.body.success = true;
        res.body.message = "workshift created.";
    })       
});

//check non existent workshift
test('PUT /api/v2/availabilities/:id - non existent workshift', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + new ObjectId + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 15,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(400)
    .expect((res) => {
        res.body.success = true;
        res.body.message = "The workshift does not exist";
    })       
});

//check if day is equal to 0 in the request
test('PUT /api/v2/availabilities/:id - day = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 0,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if month is equal to 0 in the request
test('PUT /api/v2/availabilities/:id - month = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 0,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if year is equal to 0 in the request
test('PUT /api/v2/availabilities/:id - year = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 0
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't day request
test('PUT /api/v2/availabilities:id - no day', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': '',
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't month request
test('PUT /api/v2/availabilities/id - no month', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': '',
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't year request
test('PUT /api/v2/availabilities/:id - no year', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': ''
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't hour start time request
test('PUT /api/v2/availabilities/:id - no hour start time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': '',
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't minute start time request
test('PUT /api/v2/availabilities/:id - no minute start time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': ''
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't hour end time request
test('PUT /api/v2/availabilities/:id - no hour end time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': '',
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't minute end time request
test('PUT /api/v2/availabilities/:id - no minute end time', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': ''
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't instructor request
test('PUT /api/v2/availabilities/:id - no instructor', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : '',
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if duration is equal to 0 in the request
test('PUT /api/v2/availabilities/:id - duration = 0', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 0
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if there isn't duration request
test('PUT /api/v2/availabilities/:id - no duration', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': ''
    })
    .expect(412)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Some required filed are emtpy or incorrect";
    })       
});

//check if is a non existent instructor
test('PUT /api/v2/availabilities/:id - non existent instructor', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : new ObjectId,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user doesn't exist";
    })       
});

//check if user isn't an instructor
test('PUT /api/v2/availabilities/:id - user is not an instructor', async () => {

    let instructor = await User.findOne({ username: 'StudenteProva1' });
    let instructorID = instructor._id.toString();
    
    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(403)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The user isn't an instructor";
    })       
});

//check if the shift goes beyond working hours - starts too early
test('PUT /api/v2/availabilities/:id - starts too early', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 7,
            'minute': 0
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(419)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Shift goes beyond working hours";
    })       
});

//check if the shift goes beyond working hours - ends too late
test('PUT /api/v2/availabilities/:id - ends too late', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 10,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 0
        },
        'end_time' : {
            'hour': 20,
            'minute': 30
        },
        'duration': 30
    })
    .expect(419)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "Shift goes beyond working hours";
    })       
});

//check if the shift overlaps another shift - starting time in the middle
test('PUT /api/v2/availabilities/:id - overlapping - starting time in the middle', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '12',
            minute: '30'
        },
        end_time : {
            hour: '14',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '13',
                minute: '00'
            },
            {
                hour: '13',
                minute: '30'
            },
            {
                hour: '14',
                minute: '00'
            },
        ]
    }).save();
    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 21,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 13,
            'minute': 0
        },
        'end_time' : {
            'hour': 18,
            'minute': 0
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check if the shift overlaps another shift - ending time in the middle
test('PUT /api/v2/availabilities/:id - overlapping - ending time in the middle', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '12',
            minute: '30'
        },
        end_time : {
            hour: '14',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '13',
                minute: '00'
            },
            {
                hour: '13',
                minute: '30'
            },
            {
                hour: '14',
                minute: '00'
            },
        ]
    }).save();
    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 21,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 0
        },
        'end_time' : {
            'hour': 13,
            'minute': 0
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check if the shift overlaps another shift - starting before and ending after
test('PUT /api/v2/availabilities/:id - overlapping - starting before and ending after', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '12',
            minute: '30'
        },
        end_time : {
            hour: '14',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '13',
                minute: '00'
            },
            {
                hour: '13',
                minute: '30'
            },
            {
                hour: '14',
                minute: '00'
            },
        ]
    }).save();
    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 21,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 12,
            'minute': 0
        },
        'end_time' : {
            'hour': 15,
            'minute': 0
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check if the shift overlaps another shift - same time
test('PUT /api/v2/availabilities/:id - overlapping - same time', async () => {


    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '12',
            minute: '30'
        },
        end_time : {
            hour: '14',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '13',
                minute: '00'
            },
            {
                hour: '13',
                minute: '30'
            },
            {
                hour: '14',
                minute: '00'
            },
        ]
    }).save();
    let shift = await new Workshift({
        date : {
            day: '21',
            month: '11',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 21,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 12,
            'minute': 30
        },
        'end_time' : {
            'hour': 14,
            'minute': 30
        },
        'duration': 30
    })
    .expect(476)
    .expect((res) => {
        res.body.success = false;
        res.body.message = "The workshift overlaps another workshift";
    })       
});

//check correct update
test('PUT /api/v2/availabilities - correct update', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .put('/api/v2/availabilities/' + shiftID + '?token=' + token)
    .set('Content-type', 'application/json')
    .send({ 
        'date' : {
            'day': 15,
            'month': 12,
            'year': 2022
        },
        'instructor' : instructorID,
        'start_time' : {
            'hour': 9,
            'minute': 30
        },
        'end_time' : {
            'hour': 11,
            'minute': 30
        },
        'duration': 30
    })
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = "Workshift updated";
    })       
});

//check  delete workshift by non existent user
test('DELETE /api/v2/users/:id - delete workshift by non existent user', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .delete('/api/v2/availabilities/' + shiftID + '?token=' + token + '&id=' + new ObjectId)
    .set('Content-type', 'application/json')
    .expect(404)
    .expect((res) => {
        res.body.success = false;
        res.body.message == 'The user does not exist';
    })
});

//check  delete workshift by non authorized user
test('DELETE /api/v2/users/:id - delete workshift by non authorized user', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    let student = await User.findOne({ username: 'StudenteProva1' });
    let studentID = student._id.toString();

    return request(server)
    .delete('/api/v2/availabilities/' + shiftID + '?token=' + token + '&id=' + studentID)
    .set('Content-type', 'application/json')
    .expect(403)
    .expect((res) => {
        res.body.success = false;
        res.body.message == "The user isn't an instructor";
    })
});

//check  delete workshift that does not exist
test('DELETE /api/v2/users/:id - delete workshift that does not exist', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .delete('/api/v2/availabilities/' + new ObjectId + '?token=' + token + '&id=' + instructorID)
    .set('Content-type', 'application/json')
    .expect(400)
    .expect((res) => {
        res.body.success = false;
        res.body.message == "The workshift does not exist";
    })
});


//check delete workshift 
test('DELETE /api/v2/users/:id - delete workshift ', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva1' });
    let instructorID = instructor._id.toString();

    let shift = await new Workshift({
        date : {
            day: '21',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '10',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '17',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    let shiftID = shift._id.toString();

    return request(server)
    .delete('/api/v2/availabilities/' + shiftID+ '?token=' + token + '&id=' + instructorID)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = false;
        res.body.message == 'Cancellation done';
    })
});


//check all availabilities if there aren't any
test('GET /api/v2/availabilities - there are not availabilities', async () => {

    await Workshift.deleteMany({});

    return request(server)
    .get('/api/v2/availabilities/?token=' + token + '&id=' + adminID)
    .set('Content-type', 'application/json')
    .expect(204)
    .expect((res) => {
        res.body.success = false;
        res.body.message = 'There are no workshifts';
    })
});

//check all availabilities  
test('GET /api/v2/availabilities - all availabilities', async () => {

    let instructor = await User.findOne({ username: 'IstruttoreProva0' });
    let instructorID = instructor._id.toString();

    await new Workshift({
        date : {
            day: '10',
            month: '12',
            year: '2022'
        },
        instructor : instructorID,
        start_time : {
            hour: '9',
            minute: '30'
        },
        end_time : {
            hour: '11',
            minute: '30'
        },
        duration: '30',
        time_slots: [
            {
                hour: '10',
                minute: '00'
            },
            {
                hour: '10',
                minute: '30'
            },
            {
                hour: '11',
                minute: '00'
            },
        ]
    }).save();

    return request(server)
    .get('/api/v2/availabilities/?token=' + token + '&id=' + adminID)
    .set('Content-type', 'application/json')
    .expect(200)
    .expect((res) => {
        res.body.success = true;
        res.body.message = 'OK';
        res.body.workshifts = [];
    })
});

module.exports = app => {
    // Authentication controller object
    const authToken = require("../controllers/authentication.controller.js");
    //
    const tokenChecker = require("../tokenChecker");
    // User controller object
    const users = require("../controllers/users.controller.js");
    // Workshift controller object
    const availabilities = require("../controllers/availabilities.controller.js");

    var router = require("express").Router();

    // Create a new Authorization Token
    router.post('/v1/authenticationToken', authToken.create);

    //-------------------Users----------------------------
    // Create a new User
    router.post('/v1/users', tokenChecker, users.create);    
    // Retrieve all Users
    router.get('/v1/users', tokenChecker, users.findAll);  
    // Retrieve all Students
    router.get('/v1/users/students', tokenChecker, users.findStudents);
    // Retrieve all Instructors
    router.get('/v1/users/instructors', tokenChecker, users.findInstructors);
    // Retrieve a single User with id
    router.get('/v1/users/:username', tokenChecker, users.findOne);
    // Update a single User with id
    router.put('/v1/users/:id', tokenChecker, users.update);     
    // Delete a single User with id 
    router.delete('/v1/users/:id', tokenChecker, users.delete);

    //-------------------Availabilities-------------------
    // Create a new availability
    router.post('/v2/availabilities',  availabilities.create);
    // Retrieve all availabilities
    router.get('/v2/availabilities/:id',  availabilities.findAll);
    // Retrieve all availabilities of an instructor
    router.get('/v2/availabilities/:id',  availabilities.findAllofInstructor);
    // Update an availability
    router.put('/v2/availabilities/:id',  availabilities.update);
    // Delete an availability
    router.delete('/v2/availabilities/:id',  availabilities.delete);
    
    app.use('/api', router);
};
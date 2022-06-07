module.exports = app => {
    // Authentication controller object
    const authToken = require("../controllers/authentication.controller.js");
    //
    const tokenChecker = require("../tokenChecker");
    const adminChecker = require("../adminChecker");
    // User controller object
    const users = require("../controllers/users.controller.js");
    // Workshift controller object
    const availabilities = require("../controllers/availabilities.controller.js");

    var router = require("express").Router();

    // Create a new Authorization Token
    router.post('/v1/authenticationToken', authToken.create);

    //-------------------Users----------------------------
    // Create a new User
    router.post('/v1/users', tokenChecker, adminChecker, users.create);    
    // Retrieve all Users
    router.get('/v1/users', tokenChecker, adminChecker, users.findAll);  
    // Retrieve all Students
    router.get('/v1/users/students', tokenChecker, adminChecker, users.findStudents);
    // Retrieve all Instructors
    router.get('/v1/users/instructors', tokenChecker, adminChecker, users.findInstructors);
    // Retrieve a single User with id
    router.get('/v1/users/:username', tokenChecker, adminChecker, users.findOne);
    // Update a single User with id
    router.put('/v1/users/:id', tokenChecker, adminChecker, users.update);     
    // Delete a single User with id 
    router.delete('/v1/users/:id', tokenChecker, adminChecker, users.delete);

    //-------------------Availabilities-------------------
    // Create a new availability
    router.post('/v2/availabilities', tokenChecker, availabilities.create);
    // Retrieve all availabilities
    router.get('/v2/availabilities', tokenChecker, adminChecker, availabilities.findAll);
    // Retrieve all availabilities of an instructor
    router.get('/v2/availabilities/:id', tokenChecker, availabilities.findAllofInstructor);
    // Update an availability
    router.put('/v2/availabilities/:id', tokenChecker, availabilities.update);
    // Delete an availability
    router.delete('/v2/availabilities/:id', tokenChecker, availabilities.delete);
    
    app.use('/api', router);
};
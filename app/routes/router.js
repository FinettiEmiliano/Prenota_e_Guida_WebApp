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
    router.post('/authenticationToken', authToken.create);
    // Create a new User
    router.post('/users', tokenChecker, users.create);    
    // Retrieve all Users
    router.get('/users', tokenChecker, users.findAll);  
    // Retrieve all Students
    router.get('/users/students', tokenChecker, users.findStudents);
    // Retrieve all Instructors
    router.get('/users/instructors', tokenChecker, users.findInstructors);
    // Retrieve a single User with id
    router.get('/users/:username', tokenChecker, users.findOne);
    // Update a single User with id
    router.put('/users/:id', tokenChecker, users.update);     
    // Delete a single User with id 
    router.delete('/users/:id', tokenChecker, users.delete);

    //-------------------Availabilities-------------------
    // Create a new availability
    router.post('/availabilities',  availabilities.create);
    // Retrieve all availabilities
    router.get('/availabilities/:id',  availabilities.findAll);
    // Update an availability
    router.put('/availabilities/:id',  availabilities.update);
    // Delete an availability
    router.delete('/availabilities/:id',  availabilities.delete);
    
    app.use('/api/v1', router);
};
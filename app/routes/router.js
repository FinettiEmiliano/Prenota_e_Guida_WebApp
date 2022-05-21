module.exports = app => {
    // Authentication controller object
    const authToken = require("../controllers/authentication.controller.js");
    // User controller object
    const users = require("../controllers/users.controller.js");

    var router = require("express").Router();
    // Create a new Authorization Token
    router.post('/authenticationToken', authToken.create);

    // Create a new User
    router.post('/users', users.create);
    // Retrieve a single User with id
    router.get('/users/:id', users.findOne);
    // Update a single User with id
    router.put('/users/:id', users.update);
    // Delete a single User with id 
    router.delete('/users/:id', users.delete);
    // Retrieve all Users
    router.get('/users', users.findAll);
    // Retrieve all Students
    router.get('/users/students', users.findStudents);
    // Retrieve all Instructors
    router.get('/users/instructors', users.findInstructors);
    // Delete all Users
    router.delete('/', users.deleteAll);
    app.use('/api/v1', router);
};
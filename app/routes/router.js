module.exports = app => {
    // Authentication controller object
    const authToken = require("../controllers/authentication.controller.js");
    // User controller object
    const users = require("../controllers/users.controller.js");
    var router = require("express").Router();
    // Create a new Authorization Token
    router.post('/authenticationToken', authToken.create);
    // Create a new User
    router.post('/', users.create);
    // Retrieve a single User with id
    router.post('/:id', users.findOne);
    // Update a single User with id
    router.post('/:id', users.update);
    // Delete a single User with id
    router.post('/:id', users.delete);
    // Retrieve all Users
    router.post('/', users.findAll);
    // Retrieve all Students
    router.post('/students', users.findStudents);
    // Retrieve all Instructors
    router.post('/instructors', users.findInstructors);
    // Delete all Users
    router.post('/', users.deleteAll);
    app.use('/api/v1/users', router);
};
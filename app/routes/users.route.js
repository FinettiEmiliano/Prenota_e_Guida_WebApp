module.exports = app => {
    const authToken = require("../controllers/users.controller.js");
    var router = require("express").Router();






    // Create a new Authorization Token
    router.post('/user', authToken.create);
    app.use('/api/v1/users', router);
};
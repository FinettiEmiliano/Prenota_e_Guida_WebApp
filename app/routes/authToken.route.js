module.exports = app => {
    const authToken = require("../controllers/authToken.controller.js");
    var router = require("express").Router();
    // Create a new Authorization Token
    router.post('/authenticationToken', authToken.create);
    app.use('/api/v1', router);
};
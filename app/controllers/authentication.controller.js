const db = require('../models/db.model'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/user.model');// get out user model

//async 
exports.create = async(req, res) => {

    // find the user
    let user = await User.findOne({
        username: req.body.username
    }).exec();

    // user not found
    if (!user) return res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });

    // check if password matches
    if (user.password != req.body.password) return res.status(400).json({ success: false, message: 'Authentication failed. Wrong password.' });

    // if user is found and password is right create a token
    var payload = {
        username: user.username,
        id: user._id
            // other data encrypted in the token	
    }
    var options = {
        expiresIn: 86400 // expires in 24 hours
    }
    var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

    res.status(200).json({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        id: user._id,
        user_type: user.user_type,
        username: user.username,
        name: user.name,
        surname: user.surname,
        self: "api/v1/authenticationToken/" + user._id
    });

};
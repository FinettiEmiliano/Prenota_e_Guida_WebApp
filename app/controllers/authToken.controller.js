const db = require('../models/config.model'); // get our mongoose model
const User = db.user;
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

//async 
exports.create = async(req, res) => {

    // find the user
    let user = await User.findOne({
        username: req.body.username
    }).exec();

    // user not found
    if (!user) return res.json({ success: false, message: 'Authentication failed. User not found.' });

    // check if password matches
    if (user.password != req.body.password) return res.json({ success: false, message: 'Authentication failed. Wrong password.' });

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

    res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        username: user.username,
        id: user._id,
        self: "api/v1/authenticationToken" + user._id
    });

};
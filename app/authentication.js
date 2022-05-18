require('dotenv').config();
const express = require('express');
const app = express();
const Users = require('./models/users'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const mongoose = require('mongoose');

app.use(express.json());
mongoose.connect(process.env.DB_URL); // connection to the database

// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
app.post('/api/v1/login', async function(req, res) {
	
	// find the user
	let user = await Users.findOne({
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
		self: "api/v1/" + user._id
	});

});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening on port '+ port +'...'));
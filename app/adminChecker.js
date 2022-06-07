const mongoose = require('mongoose');
const User = require('../app/models/user.model');

const adminChecker = async (req, res, next) => {
	
	// check header or url parameters or post parameters for id
	var id = req.body.id || req.query.id || req.headers['id'];
	res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
	// if there is no id
	if (id == undefined) {
		return res.status(401).send({ 
			success: false,
			message: 'No id provided.'
		});
	}

    let user = await User.findOne({ _id: id }).exec();

    //if the id isn't valid
    if (!user) {
		return res.status(404).send({ 
			success: false,
			message: 'A user with the specified ID was not found.'
		});
	}

	//verifies user role
    if (user.user_type != "Amministratore") {
        return res.status(403).send({
            success: false,
            message: 'You are not an admin'
        });		
    } else {
        // if everything is good, save to request for use in other routes
        next();
    }
	
};

module.exports = adminChecker
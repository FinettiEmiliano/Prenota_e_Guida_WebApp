const db = require('../models/db.model'); // get our mongoose model
const User = db.user;
const utente = require('../models/user.model');// get out user model

//async 
exports.findAll = async(req, res) => {

    let users = await User.find({});
    users = users.map( (user) => {
        return {
            username: user.username,
            password: user.password,
            user_type: user.user_type,
            name: user.name,
            surname: user.surname,
            photo: user.photo
        };
    });
    return res.json(users);

};

exports.create = async(req,res) => {

   //create username
    var tempUsername = req.body.name + req.body.surname;
    //count if there are other user with same username
    const temp = await User.count({username: tempUsername});
    //udpdate username
    tempUsername+= temp.toString();
    //generator of a random password
    const ps = Math.random().toString(36).substring(2,7);

    const newUtente = {
        username: tempUsername,
        password: ps,
        user_type: req.body.user_type,
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo
    };
    
    return res.json({ success: true, message: 'Inserimento avvenuto' });
};


/*
{   "user_type": "Studente",
    "name": "Cristiano",
    "surname": "Ronaldo",
    "photo": "crustiano777.hpeg"
}
*/
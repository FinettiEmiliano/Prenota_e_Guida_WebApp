const db = require('../models/db.model'); // get our mongoose model
const utente = require('../models/user.model');// get out user model



exports.create = async(req,res) => {

    //create username
     var tempUsername = req.body.name + req.body.surname;
     //count if there are other user with same username
     const temp = await utente.count({username: tempUsername});
     //udpdate username
     tempUsername+= temp.toString();
     //generator of a random password
     const ps = Math.random().toString(36).substring(2,7);
 
     let newUtente = new utente ({
         username: tempUsername,
         password: ps,
         user_type: req.body.user_type,
         name: req.body.name,
         surname: req.body.surname,
         photo: req.body.photo
     });
 
     newUtente = await newUtente.save();
     
     return res.json({ success: true, message: 'Inserimento avvenuto' });
 };

//async 
exports.findAll = async(req, res) => {

    let users = await utente.find({});
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

exports.findStudents = async(req,res) => {
    let users = await utente.find({user_type : "Studente"});
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
}

exports.findInstructors = async(req,res) =>{
    
    let users = await utente.find({user_type : "Istruttore"});
    users = users.map( (user) => {
        return {
            username: user.username,
            password: user.password,
            user_type: user.user_type,
            name: user.name,
            surname: user.surname,
            photo: user.photos
        };
    });
    return res.json(users);
}

exports.delete = async(req,res) => {

    utente.findByIdAndRemove(req.params.id, function (err, docs) {
        if (err){
            console.log(err)
        }
        else{
            console.log("Removed User : ", docs);
        }
    });
    return res.json({success: false, messagge: "Manca la funzione in delete"});

}

//funziona
exports.findOne = async(req,res) => {
    const temp = await utente.findById(req.params.id);
    //res.json(temp);
    return res.json(temp);
    //return res.json({success: false, messagge: "Manca la funzione in findOne"});
}

exports.update = async(req, res) => {

    return res.json({success: false, messagge: "Manca la funzione in update"});
}

exports.deleteAll = async(req,res) => {

    utente.remove({});
    return res.json({success: false, messagge: "Manca la funzione in deleteAll"});
    //return res.json();
}




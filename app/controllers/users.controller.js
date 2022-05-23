//const db = require('../models/db.model'); // get our mongoose model
const User = require('../models/user.model'); // get out user model

exports.create = async(req, res) => {

    //check if there are name and surname in the request
    if (req.body.name == "" || req.body.surname == "" || req.body.user_type == "")
        return res.status(400).json({ success: false, message: "Name, surname or user_type undefined" });

    //count if there are other user with same username
    const temp = await User.count({
        name: req.body.name,
        surname: req.body.surname
    }).exec();
    //udpdate username
    let tempUsername = req.body.name + req.body.surname + temp.toString();

    //generator of a random password
    const ps = Math.random().toString(36).substring(2, 7);

    let newUser = new User({
        username: tempUsername,
        password: ps,
        user_type: req.body.user_type,
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo
    });
    await newUser.save();

    return res.status(200).json({ success: true, message: "insertion done" });
}

exports.findAll = async(req, res) => {

    let users = await User.find({}).exec();
    //check if there are users
    if (!users)
        return res.status(404).json({ success: false, message: "There are no users" })

    users = users.map((user) => {
        return {
            id: user._id,
            username: user.username,
            password: user.password,
            user_type: user.user_type,
            name: user.name,
            surname: user.surname,
            photo: user.photo
        };
    });

    return res.status(200).json(users);
}

exports.findStudents = async(req, res) => {

    let users = await User.find({ user_type: "Studente" }).exec();
    //check if there are students
    if (!users)
        return res.status(404).json({ success: false, message: "There are no students" })

    users = users.map((user) => {
        return {
            id: user._id,
            username: user.username,
            password: user.password,
            user_type: user.user_type,
            name: user.name,
            surname: user.surname,
            photo: user.photo
        };
    });

    return res.status(200).json(users);
}

exports.findInstructors = async(req, res) => {

    let users = await User.find({ user_type: "Istruttore" }).exec();
    //check if there are instructors
    if(!users)
        return res.status(404).json({success: false, message: "There are no instructor"})
   
    users = users.map( (user) => {
        return {
            id: user._id,
            username: user.username,
            password: user.password,
            user_type: user.user_type,
            name: user.name,
            surname: user.surname,
            photo: user.photo
        };
    });

    return res.status(200).json(users);
}

exports.delete = async(req, res) => {

    let user = await User.findByIdAndRemove(req.params.id).exec();
    //check if exist the user
    if (!user)
        return res.status(404).json({ success: false, message: "The user does not exist" })

    return res.json({ success: true, messagge: "Cancellation done" });
}

exports.findOne = async(req, res) => {

    let user = await User.find({ username: req.headers['username'] }).exec();

    //chek if the user exists
    if (!user)
        return res.status(404).json({ success: false, message: "The user does not exist" })

    user = user.map( (user) => {
        return {
            id: user._id,
            username: user.username,
            password: user.password,
            user_type: user.user_type,
            name: user.name,
            surname: user.surname,
            photo: user.photo
        };
    });

    return res.status(200).json(user);
}

exports.update = async(req, res) => {

    //check if there are name and surname in the request
    if (req.body.name == "" || req.body.surname == "" || req.body.user_type == "")
        return res.status(400).json({ success: false, message: "Name, surname or user_type undefined" });

    //count how many users have the same name and surname 
    let tempUsername;
    let temp = await User.count({ username: req.body.username }).exec();

    //check if the username was changed
    if (temp == 1)
        tempUsername = req.body.username;
    else {
        //count how many users have the same name and surname
        temp = await User.count({
            name: req.body.name,
            username: req.body.surname
        }).exec();

        tempUsername = req.body.name + req.body.surname + temp;
    }
    //create the password
    let psw;
    //check if the password must to be change

    if (req.body.changePsw)
        psw = Math.random().toString(36).substring(2, 7);
    else
        psw = req.body.password;

    await User.findByIdAndUpdate(req.params.id, {
        username: tempUsername,
        password: psw,
        user_type: req.body.user_type,
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo
    });
    return res.status(200).json({ success: true, messagge: "Update done" });
}

exports.deleteAll = async(req, res) => {

    return res.status(400).json({ success: false, messagge: "Non la si implementa" });
}
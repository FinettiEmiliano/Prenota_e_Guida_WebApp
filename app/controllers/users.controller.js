const User = require('../models/user.model'); // get out user model

exports.create = async(req, res) => {

    //check if there are name and surname in the request
    if (req.body.name == "" || req.body.surname == "" || req.body.user_type == "")
        return res.status(400).json({ success: false, message: "Name, surname or user_type undefined." });

    //count how many users have the sanme username and create one
    var temp = 0;
    let tempUsername = req.body.name + req.body.surname + temp.toString();
    let n = await User.count({username: tempUsername}).exec();
    while(n!=0){
        tempUsername = req.body.name + req.body.surname + temp.toString();
        temp++;
        n = await User.count({username: tempUsername}).exec();
    }
    

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

    return res.status(200).json({ success: true, message: "User created." });
}

exports.findAll = async(req, res) => {

    let users = await User.find({}).exec();
    //check if there are users
    if (!users)
        return res.status(404).json({ success: false, message: "There are no Users" })

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

    return res.status(200).json({
        success: true,
        message: 'OK.',
        users: users
    });
}

exports.findStudents = async(req, res) => {

    let users = await User.find({ user_type: "Studente" }).exec();
    //check if there are students
    if (!users)
        return res.status(404).json({ success: false, message: "There are no Students." })

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

    return res.status(200).json({
        success: true,
        message: 'OK.',
        users: users
    });
}

exports.findInstructors = async(req, res) => {

    let users = await User.find({ user_type: "Istruttore" }).exec();
    //check if there are instructors
    if (!users)
        return res.status(404).json({ success: false, message: "There are no Instructors." })

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

    return res.status(200).json({
        success: true,
        message: 'OK.',
        users: users
    });
}

exports.delete = async(req, res) => {

    let user = await User.findByIdAndRemove(req.params.id).exec();
    //check if exist the user
    if (!user)
        return res.status(404).json({ success: false, message: "The user does not exist" })

    return res.json({ success: true, messagge: "Cancellation done" });
}

exports.findOne = async(req, res) => {

    let user = await User.find({ username: req.params.username }).exec();

    //chek if the user exists
    if (!user)
        return res.status(404).json({ success: false, message: "A User with the specified ID was not found." })

    user = user.map((user) => {
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

    return res.status(200).json({
        success: true,
        message: 'OK.',
        users: user
    });
}

exports.update = async(req, res) => {

    //chek if the user exists
    let user = await User.findById({ _id: req.params.id }).exec();
    if (!user)
        return res.status(404).json({ success: false, message: "A user with the specified ID was not found." })
    
    //check if the there was a change in the name or surname
    if(req.body.name.localeCompare(user.name)==0 && req.body.surname.localeCompare(user.surname)==0)
        return res.status(200).json({ success: true, message: "User updated" })
    
    
    //check if there are name, surname and user_type in the request
    if (req.body.name == "" || req.body.surname == "" || req.body.user_type == "")
        return res.status(400).json({ success: false, message: "Name, surname or user_type undefined" });

    //count how many users have the sanme username and create one
    var temp = 0;
    let tempUsername = req.body.name + req.body.surname + temp.toString();
    let n = await User.count({username: tempUsername}).exec();
    while(n!=0){
        tempUsername = req.body.name + req.body.surname + temp.toString();
        temp++;
        n = await User.count({username: tempUsername}).exec();
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
    return res.status(200).json({ success: true, messagge: "User updated" });
}
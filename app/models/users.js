var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const User_type = {
    TEACHER: 0,
    STUDENT: 0,
    ADMIN: 0
}

module.exports = mongoose.model("Users", new Schema({
    username: String, 
    password: String,
    user_type: {type: User_type} ,    //sarebbe enum
    name: String,
    surname: String,
    photo: String                     // come??
}));
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Type_user = {
    TEACHER: 0,
    STUDENT: 0,
    ADMIN: 0
}

module.exports = mongoose.model("Users", new Schema({
    user_name: String, 
    password: String,
    type_user: {type: Type_user} ,    //sarebbe enum
    name: String,
    surname: String,
    photo: String                     // come??
}));
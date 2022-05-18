var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model("Users", new Schema({
    username: String, 
    password: String,
    user_type: String,    //sarebbe enum
    name: String,
    surname: String,
    photo: String                     // come??
}));
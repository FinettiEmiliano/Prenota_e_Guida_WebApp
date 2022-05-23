var mongoose = require('mongoose');

module.exports = mongoose.model(
        "user",
        new mongoose.Schema({
            username: String,
            password: String,
            user_type: String,
            name: String,
            surname: String,
            photo: String
        }, { timestamps: true })
    );


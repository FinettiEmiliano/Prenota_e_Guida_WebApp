var mongoose = require('mongoose');

module.exports = mongoose.model(
    "data",
    new mongoose.Schema({
        day: Number,
        month: Number,
        year: Number,
    })
);
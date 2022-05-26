var mongoose = require('mongoose');
const db = require('./db.model');
const User = require('./availability.model');

const Date = new mongoose.Schema({
    day: Number,
    month: Number,
    year: Number,
});
const Time = new mongoose.Schema({
    hour: Number,
    minute: Number,
})

module.exports = mongoose.model(
    "availability",
    new mongoose.Schema({
        date: Date,
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            //required: true
        },
        start_time: Time,
        end_time: Time,
        duration: {
            type: Number,
            //required: true
        },
        time_slots: [Time]
    }, { timestamps: true }),
    "availabilities",
);
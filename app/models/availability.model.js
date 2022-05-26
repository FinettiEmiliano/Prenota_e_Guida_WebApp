var mongoose = require('mongoose');
const Data = require("./data.model.js")(mongoose);
const Instructor = require("./user.model.js")(mongoose);
const Time = require("./time.model.js")(mongoose);

module.exports = mongoose.model(
    "availability",
    new mongoose.Schema({
        workshift: Data,
        instructor_username: {
            type: Instructor.username,
            required: true
        },
        start_time: Time,
        end_time: Time,
        duration: {
            type: Number,
            required: true
        },
        time_slots: [Time]
    }, { timestamps: true }),
    "availabilities",
);
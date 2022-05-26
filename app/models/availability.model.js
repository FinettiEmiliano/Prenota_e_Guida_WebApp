var mongoose = require('mongoose');
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
        instructor_username: {
            type: String,
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
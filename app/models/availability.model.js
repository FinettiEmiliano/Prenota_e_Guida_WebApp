var mongoose = require('mongoose');

const Date = new mongoose.Schema({
    day: Number,
    month: Number,
    year: Number
});
const Time = new mongoose.Schema({
    hour: Number,
    minute: Number
})

module.exports = mongoose.model(
    "availability",
    new mongoose.Schema({
        date: Date,
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        start_time: Time,
        end_time: Time,
        duration: {
            type: Number
        },
        time_slots: [Time]
    }, { timestamps: true }),
    "availabilities"
);
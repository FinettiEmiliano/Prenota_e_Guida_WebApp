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
const Lecture = new mongoose.Schema({
    id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "availability.time_slots"
    },
    date: Date,
    start_time: Time
});

module.exports = mongoose.model(
    "reservation",
    new mongoose.Schema({
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        },
        time_slot: Lecture,
    }, { timestamps: true }),
    "reservations"
);
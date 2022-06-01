var mongoose = require('mongoose');

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
        time_slot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "availability.time_slot"
        }
    }, { timestamps: true }),
    "reservations"
);
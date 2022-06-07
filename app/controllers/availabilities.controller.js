const Workshift = require('../models/availability.model'); // get out availability model
const User = require('../models/user.model'); // get out user model

//admin settings --> to implement in a following user story
const opening_hour = 8;
const opening_minute = 0;
const closing_hour = 20;
const closing_minute = 0;

exports.create = async(req, res) => {

    //check if there are some empty or incorrect field in the request
    if (isCorrect(req))
        return res.status(412).json({ success: false, message: "Some required filed are emtpy or incorrect" });

    //check instructor
    let instructor = await User.findOne({ _id: req.body.instructor }).exec();
    if (instructor == null)
        return res.status(404).json({ success: false, message: "The user doesn't exists" });
    else if (instructor.user_type != "Istruttore")
        return res.status(403).json({ success: false, message: "The user isn't an instructor" });

    //check if the shift goes beyond working hours
    if (isBeyond(req))
        return res.status(409).json({ success: false, message: "Shift goes beyond working hours" });

    //overlapping check
    let overlaps = false;
    let workshifts = await Workshift.find({ instructor: req.body.instructor }).exec();
    workshifts.forEach(element => {
        if (element.instructor == req.body.instructor) {
            if (isOverlapping(req, element, "update")) {
                overlaps = true;
            }
        }
    });

    if (overlaps)
        return res.status(476).json({ success: false, message: "The workshift overlaps another workshift" });

    //divide shift into slots
    let slots = slotsMaker(req);

    let newWorkshift = new Workshift({
        date: req.body.date,
        instructor: req.body.instructor,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        duration: req.body.duration,
        time_slots: slots
    });
    await newWorkshift.save();

    return res.status(201).json({ success: true, message: "workshift created." });
}

exports.findAllofInstructor = async(req, res) => {

    let workshifts = await Workshift.find({ instructor: req.params.id }).exec();

    //check if there are workshifts
    if (workshifts.length == 0)
        return res.status(209).json({ success: false, message: "There are no workshifts" })

    workshifts = workshifts.map((workshifts) => {
        return {
            id: workshifts._id,
            date: workshifts.date,
            instructor: workshifts.instructor,
            start_time: workshifts.start_time,
            end_time: workshifts.end_time,
            duration: workshifts.duration,
            time_slots: workshifts.time_slots
        };
    });

    return res.status(200).json({
        success: true,
        message: 'OK.',
        workshifts: workshifts
    });
}

exports.findAll = async(req, res) => {

    let workshifts = await Workshift.find().exec();

    //check if there are workshifts
    if (workshifts.length == 0)
        return res.status(209).json({ success: false, message: "There are no workshifts" })

    workshifts = workshifts.map((workshifts) => {
        return {
            id: workshifts._id,
            date: workshifts.date,
            instructor: workshifts.instructor,
            start_time: workshifts.start_time,
            end_time: workshifts.end_time,
            duration: workshifts.duration,
            time_slots: workshifts.time_slots
        };
    });

    return res.status(200).json({
        success: true,
        message: 'OK.',
        workshifts: workshifts
    });
}

exports.update = async(req, res) => {

    let workshift = await Workshift.findById({ _id: req.params.id }).exec();

    //check if the workshift exists
    if (!workshift)
        return res.status(400).json({ success: false, message: "The workshift does not exist" })

    //check if there are some empty or incorrect field in the request
    if (isCorrect(req))
        return res.status(412).json({ success: false, message: "Some required filed are emtpy or incorrect" });

    //check instructor
    let instructor = await User.findOne({ _id: req.body.instructor }).exec();
    if (instructor == null)
        return res.status(404).json({ success: false, message: "The user doesn't exists" });
    else if (instructor.user_type != "Istruttore")
        return res.status(403).json({ success: false, message: "The user isn't an instructor" });

    //check if the shift goes beyond working hours
    if (isBeyond(req))
        return res.status(419).json({ success: false, message: "Shift goes beyond working hours" });

    //overlapping check
    let overlaps = false;
    let workshifts = await Workshift.find({ instructor: req.body.instructor }).exec();
    workshifts.forEach(element => {
        if (element.instructor == req.body.instructor) {
            if (isOverlapping(req, element, "update")) {
                overlaps = true;
            }
        }
    });

    if (overlaps)
        return res.status(476).json({ success: false, message: "The workshift overlaps another workshift" });

    //divide shift into slots
    let slots = slotsMaker(req);

    await Workshift.findByIdAndUpdate(req.params.id, {
        date: req.body.date,
        instructor: req.body.instructor,
        start_time: req.body.start_time,
        end_time: req.body.end_time,
        duration: req.body.duration,
        time_slots: slots
    });

    return res.status(200).json({ success: true, messagge: "Workshift updated" });
}

exports.delete = async(req, res) => {

    //check instructor
    let instructor = await User.findOne({ _id: req.query.id }).exec();
    if (instructor == null)
        return res.status(404).json({ success: false, message: "The user doesn't exists" });
    else if (instructor.user_type != "Istruttore" && instructor.user_type != "Amministratore")
        return res.status(403).json({ success: false, message: "The user isn't an instructor" });

    let workshift = await Workshift.findByIdAndRemove(req.params.id).exec();

    //check if the workshift exist
    if (!workshift)
        return res.status(400).json({ success: false, message: "The workshift does not exist" })

    return res.status(200).json({ success: true, messagge: "Cancellation done" });
}

//function to check if there are some empty or incorrect field in the request
function isCorrect(req){
    let req_start = (req.body.start_time.hour * 60) + req.body.start_time.minute;
    let req_end = (req.body.end_time.hour * 60) + req.body.end_time.minute;
  
    if (req.body.date.day === 0 || req.body.date.month === 0 || req.body.date.year === 0 ||
        req.body.date.day === "" || req.body.date.month === "" || req.body.date.year === "" ||
        req.body.start_time.hour === "" || req.body.start_time.minute === "" ||
        req.body.end_time.hour === "" || req.body.end_time.minute === "" ||
        req.body.instructor === "" || req.body.duration === 0 || req.body.duration === "")
        return true;
    if(req_start >= req_end || req.body.duration > (req_end - req_start))
        return true;

    return false
}

//function to check if the shift goes beyond working hours
function isBeyond(req) {
    let req_start = (req.body.start_time.hour * 60) + req.body.start_time.minute;
    let req_end = (req.body.end_time.hour * 60) + req.body.end_time.minute;
    let opening = (opening_hour * 60) + opening_minute;
    let closing = (closing_hour * 60) + closing_minute;
  
    if (req_start < opening || req_end > closing)
        return true;

    return false
}

//overlapping check function
function isOverlapping(req, element){
    let req_start = (req.body.start_time.hour * 60) + req.body.start_time.minute;
    let element_start = (element.start_time.hour * 60) + element.start_time.minute;
    let req_end = (req.body.end_time.hour * 60) + req.body.end_time.minute;
    let element_end = (element.end_time.hour * 60) + element.end_time.minute;

    if (req.body.date.day == element.date.day && req.body.date.month == element.date.month && req.body.date.year == element.date.year && req.params.id != element._id) { //date check
        if ((req_start > element_start && req_start < element_end) || //starting time in the middle
            (req_end > element_start && req_end < element_end) || //ending time in the middle
            (req_start < element_start && req_end > element_end) || //starting before and ending after
            (req_start === element_start && req_end === element_end)) //same time
            return true;
    }
    return false
}

//divide shift in slots
function slotsMaker(req) {
    let req_start = (req.body.start_time.hour * 60) + req.body.start_time.minute;
    let req_end = (req.body.end_time.hour * 60) + req.body.end_time.minute;
    let slotsNumber = Math.floor((req_end - req_start) / req.body.duration);
    let slots = [];

    for (i = 0; i < slotsNumber; i++) {
        let hour = Math.floor((req_start + (req.body.duration * i)) / 60);
        let minute = ((req_start + (req.body.duration * i)) % 60);
        slots.push({
            hour: hour,
            minute: minute
        })
    }
    return slots;
}
const workshift = require('../models/availability.model'); // get out user model

exports.create = async(req, res) => {

    //check if there are some empty required field in the request
    if (req.body.workshift.hStart == "" || req.body.workshift.mStart == "" || req.body.workshift.hEnd == "" || 
        req.body.workshift.mEnd == "" || req.body.workshift.day == "" || req.body.workshift.month == "" ||
        req.body.workshift.year == "" || req.body.instructor == "" || req.body.duration == "")
        return res.status(400).json({ success: false, message: "Name, surname or user_type undefined." });
    
    //overlapping check
    let workshifts = await workshift.find({}).exec();
    workshifts.array.forEach(element => {
        if( (new.start < old.end && new.end > old.start) ||
        (new.end > old.start && new.end < old.end) ||
        (new.start < old.start && new.end > old.end))
            return res.status(400).json({ success: false, message: "The workshift overlaps another workshift" });
    });

    let newworkshift = new workshift({
        workshift : {
            hStart : req.body.workshift.hStart,
            mStart : req.body.workshift.mStart,
            hEnd : req.body.workshift.hEnd,
            mEnd : req.body.workshift.mEnd,
            day : req.body.workshift.day,
            month : req.body.workshift.month,
            year : req.body.workshift.year
        },
        instructor : req.body.instructor,
        duration : req.body.duration
    });
    await newworkshift.save();

    return res.status(200).json({ success: true, message: "workshift created." });
}

exports.findAll = async(req, res) => {

    let workshifts = await workshift.find({}).exec();
    //check if there are workshifts
    if (!workshifts)
        return res.status(404).json({ success: false, message: "There are no workshifts" })

    workshifts = workshifts.map((workshifts) => {
        return {
            
        };
    });

    return res.status(200).json({
        success: true,
        message: 'OK.',
        workshifts: workshifts
    });
}

exports.update = async(req, res) => {
    let workshift = await workshift.findById({ _id: req.params.id }).exec();
    //check if the workshift exist
    if (!workshift)
        return res.status(404).json({ success: false, message: "The workshift does not exist" })

    //check if there are some empty required field in the request
    if (req.body.workshift.hStart == "" || req.body.workshift.mStart == "" || req.body.workshift.hEnd == "" || 
        req.body.workshift.mEnd == "" || req.body.workshift.day == "" || req.body.workshift.month == "" ||
        req.body.workshift.year == "" || req.body.instructor == "" || req.body.duration == "")
        return res.status(400).json({ success: false, message: "Name, surname or user_type undefined." });
    
    //overlapping check
    let workshifts = await workshift.find({}).exec();
    workshifts.array.forEach(element => {
        if( (new.start < old.end && new.end > old.start) ||
        (new.end > old.start && new.end < old.end) ||
        (new.start < old.start && new.end > old.end))
            return res.status(400).json({ success: false, message: "The workshift overlaps another workshift" });
    });

    await User.findByIdAndUpdate(req.params.id, {
        username: tempUsername,
        password: psw,
        user_type: req.body.user_type,
        name: req.body.name,
        surname: req.body.surname,
        photo: req.body.photo
    });
    return res.status(200).json({ success: true, messagge: "User updated" });
}

exports.delete = async(req, res) => {

    let workshift = await workshift.findByIdAndRemove(req.params.id).exec();
    //check if the workshift exist
    if (!workshift)
        return res.status(404).json({ success: false, message: "The workshift does not exist" })

    return res.json({ success: true, messagge: "Cancellation done" });
}
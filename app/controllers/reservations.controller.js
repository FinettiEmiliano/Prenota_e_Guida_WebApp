const Workshift = require('../models/availability.model'); // get out availability model
const User = require('../models/user.model'); // get out user model
const Reservation = require('../models/reservation.model'); // get out reservation model
const { json } = require('express');
const { ObjectId } = require('bson');

exports.create = async(req, res) => {
    //check if id in params is correct
    let user = await User.findById(req.params.id).exec();
    if(user == null)
        return res.status(404).json({ success: false, message: "The user doesn't exist" });
    else if(user.user_type != "Studente")
        return res.status(403).json({ success: false, message: "The user in params isn't a student" });            

    //retrieve all datas necessary to create a new reservation and save in an array 
    const temp = []; 
    var index = 0;
    let workshifts = await Workshift.find({}).exec();      
    workshifts.forEach(element =>  {
        element.time_slots.forEach((type)=>{
            temp[index++] = type._id;
            temp[index++] = element.instructor;
            temp[index++] = type.hour;
            temp[index++] = type.minute;
            temp[index++] = element.date.day;
            temp[index++] = element.date.month;
            temp[index++] = element.date.year;
        })
    });

    //create the new reservation array ( if slotID exist)
    let check=1;
    const reservation = [];
    index = 0;
    for(var i=0;i<temp.length && check!=0 ;i+=7){
        check = temp[i].toString().localeCompare(req.body.slotID.toString());
        if(check==0){
            reservation[index++]=temp[i+1].toString();
            reservation[index++]=req.params.id.toString();
            reservation[index++]=temp[i];
            reservation[index++]=temp[i+4];
            reservation[index++]=temp[i+5];
            reservation[index++]=temp[i+6];
            reservation[index++]=temp[i+2];
            reservation[index++]=temp[i+3];
        }
    }
    if(check!=0)    //if slotID does not exist return an error
        return res.status(481).json({success: false, message: "The slotID does not exist in availabilities"});

    //check if idSlot already exists in reservations
    let idRes = await Reservation.find( { } ).exec();
    var arr = [];
    index = 0;
    idRes.forEach(element => {
            arr[index++]=element.time_slot.id;
    });
    for(var i=0;i<arr.length;i++)
    if(arr[i].toString().localeCompare(req.body.slotID)==0)
        return res.status(491).json({success: false, nessage: "Reservation already made"});
    
    //save the new reservation
    let newReservation = new Reservation({
        instructor: new ObjectId (reservation[0]),
        student: new ObjectId (reservation[1]),
        time_slot: {
            id: new ObjectId(reservation[2]),
            date: {
                day: reservation[3],
                month: reservation[4],
                year: reservation[5],
            },
            start_time: {
                hour: reservation[6],
                minute: reservation[7],
            }
        }
    });
    await newReservation.save();
    return res.status(201).json({success: true, nessage: "Reservation done"});
}

exports.findAll = async (req,res) =>{
    //---------------------------NON VA---------------------
    //check if id in params is correct
    let user = await User.findById(req.params.id).exec();
    if(user == null)
        return res.status(404).json({ success: false, message: "The user doesn't exist" });
    else if(user.user_type != "Studente")
        return res.status(403).json({ success: false, message: "The user in params isn't a student" });  
    
    let reservation = await Reservation.find({ student: req.params.id }).exec();
    //check if there are workshifts
    if (reservation.length == 0)
        return res.status(204).json({ success: false, message: "There are no reservation of this student" })
    
    //save all reservations of that student
    reservation = reservation.map((workshifts) => {
        return {
            instructor: workshifts.instructor,
            student: workshifts.student,
            time_slot: workshifts.time_slot
        };
    });

    //retrieve all time_slots._id of all availabilities 
    const slotWorkshift = [];
    var index = 0;
    let workshifts = await Workshift.find({}).exec();      
    workshifts.forEach(element =>  {
        element.time_slots.map((time_slot) => {
            slotWorkshift[index++] = time_slot._id.toString();
        })
    });
    
    //retrieve time_slot of all reservations
    const slotReservation = [];
    index = 0;
    let allReservation = await Reservation.find({}).exec();
    allReservation = allReservation.map((element) => {
        slotReservation[index++]=element.time_slot.toString();
    });


    //retrieve all slot that aren't in Reservation but there are in availabilities DA SISTEMARE
    const freeReservation = [];
    for(var i=0; i<slotWorkshift.length; i++){
        if( slotReservation.find(element => element == slotWorkshift[i]) === undefined){
                freeReservation.push(slotWorkshift[i]);
        }
    }
        return res.status(200).json({
            success: true,
            messagge: "OK",
            reservation: reservation,
            freeReservation: freeReservation
        });
}

exports.delete = async(req, res) => {
    //------------non l'ho testato ma dovrebbe esser giusto
    //check if id in params is correct
    let user = await User.findById(req.params.id).exec();
    if(user == null)
        return res.status(404).json({ success: false, message: "The user doesn't exist" });
    else if(user.user_type != "Studente")
        return res.status(403).json({ success: false, message: "The user in params isn't a student" });  
    
    
    let reservation = await Reservation.findByIdAndRemove(req.params.id).exec();

    //check if the workshift exist
    if (!reservation)
        return res.status(400).json({ success: false, message: "The reservation does not exist" })

    return res.status(200).json({ success: true, messagge: "Cancellation done" });
}


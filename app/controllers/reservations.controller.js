const Workshift = require('../models/availability.model'); // get out availability model
const User = require('../models/user.model'); // get out user model
const Reservation = require('../models/reservation.model'); // get out reservation model
const { ObjectId } = require('bson'); 


exports.create = async(req, res) => {
    //check if id in params is correct
    let user = await User.findOne({_id: req.params.id}).exec();
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
            temp[index++] = type._id;           //id of slot_times
            temp[index++] = element.instructor; //instructor
            temp[index++] = type;               //time
            temp[index++] = element.date;       //date
            /*
            temp[index++] = type._id;           //id of slot_times
            temp[index++] = element.instructor; //instructor
            temp[index++] = type.hour;          //hour
            temp[index++] = type.minute;        //minute
            temp[index++] = element.date.day;   //day
            temp[index++] = element.date.month; //month
            temp[index++] = element.date.year;  //year
            */
        })
    });

    //check if slotID exist in time_slots of availabilities
    let check=1;    
    const reservation = [];     //array to save all datas if slotID is valid
    index = 0;
    for(var i=0;i<temp.length && check!=0 ;i+=4){
        check = temp[i].toString().localeCompare(req.body.slotID.toString());   //check if slotID is the same of time_slots._id
            if(check==0){
            reservation[index++]=temp[i+1].toString();          //instructorID
            reservation[index++]=req.params.id.toString();      //studentID
            reservation[index++]=temp[i];                       //time_slot.id
            reservation[index++]=temp[i+2]                      //time
            reservation[index++]=temp[i+3]                      //date
        }
    }
    if(check!=0)    //if slotID does not exist return an error
        return res.status(481).json({success: false, message: "The slotID does not exist in availabilities"});

    //check if idSlot already exists in reservations
    const idOfReseravions = [];     //id of all reservations
    index = 0;
    let idRes = await Reservation.find( {} ).exec();
    idRes.forEach(element => {
        idOfReseravions[index++]=element.time_slot.id.toString();

    });
    //check if reservation is already made
    for(var i=0;i<idOfReseravions.length;i++){
        if(idOfReseravions[i].localeCompare(req.body.slotID)==0)
            return res.status(491).json({success: false, nessage: "Reservation already made"});
    }
    //save the reservation
    let newReservation = new Reservation({
        instructor: new ObjectId (reservation[0]),
        student: new ObjectId (reservation[1]),
        time_slot: {
            id: new ObjectId(req.body.slotID),
            date: reservation[4],
            start_time: reservation[3]
        }
    });
    await newReservation.save();
    return res.status(201).json({success: true, message: "Reservation done"});
}

exports.findAll = async (req,res) =>{

    //check if id in params is correct
    let user = await User.findOne({_id: req.params.id}).exec();
    if(user == null)
        return res.status(404).json({ success: false, message: "The user doesn't exist" });
    else if(user.user_type != "Studente")
        return res.status(403).json({ success: false, message: "The user in params isn't a student" });  
    
    //retrieve all time_slots of all availabilities and save in temp 
    //temp = array of time_slot of workshift ( save time_slot.id, date, time)
    const temp = [];
    let index = 0;
    let allWorkshiftReservation = await Workshift.find({}).exec();
    allWorkshiftReservation.forEach((element) =>{
        element.time_slots.forEach((type)=>{
                temp[index++]=type._id;         //id of time_slot
                temp[index++]=element.date;     //date
                temp[index++]=type;             //time_slot
        })
    })

    //check if idSlot already exists in reservations
    //arr = array of reservation's id
    let idRes = await Reservation.find( { } ).exec();
    var idOfReseravions = [];
    index = 0;
    idRes.forEach(element => {
        idOfReseravions[index++]=element.time_slot.id.toString();
    });
    
    //create an array with all free time_slots (id, date, time)
    const freeReservation = [];
    index = 0;
    for(var i=0;i<temp.length;i+=3){
        if(idOfReseravions.indexOf(temp[i].toString())== -1){
            freeReservation[index++]=temp[i];   //id of time_slot
            freeReservation[index++]=temp[i+1]; //date
            freeReservation[index++]=temp[i+2]; //time_slot
        }
    }

    let reservation = await Reservation.find({ student: req.params.id }).exec();
    //check if there are workshifts for that student
    if (reservation.length == 0)
        return res.status(204).json({ success: true, message: "There are no reservation of this student", freeReservation: freeReservation });
    //save all reservations of that student
    reservation = reservation.map((temp) => {
        return {
            instructor: temp.instructor,
            student: temp.student,
            time_slot: {
                id: temp.time_slot.id,
                date: temp.time_slot.date,
                start_time: temp.time_slot.start_time,
            }
        };
    });

    const result = {
        "reservation": reservation,
        "freeReservation": freeReservation
    };

    return res.status(200).json({success: false, message: "OK", result: result});
    
}

exports.delete = async(req, res) => {
   
    let reservation = await Reservation.findByIdAndRemove(req.params.id).exec();
    //check if the workshift exist
    if (!reservation)
        return res.status(400).json({ success: false, message: "The reservation does not exist" })

    return res.status(200).json({ success: true, messagge: "Cancellation done" });
}


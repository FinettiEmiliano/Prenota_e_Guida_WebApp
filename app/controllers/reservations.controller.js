const Workshift = require('../models/availability.model'); // get out availability model
const User = require('../models/user.model'); // get out user model
const Reservation = require('../models/reservation.model'); // get out reservation model
const { ObjectId } = require('bson'); 
const { boolean } = require('webidl-conversions');

//class where to save the datas of reservations and the free time_slots of availabilities
class reservationDB {
    constructor(student,id,time, date, instructor){
        this.id = id;
        this.time = time;
        this.date = date;
        this.instructor = instructor;
        this.student = student;
    }
};

exports.create = async(req, res) => {
    //check if id in params is correct
    let user = await User.findOne({_id: req.params.id}).exec();
    if(user == null)
        return res.status(404).json({ success: false, message: "The user doesn't exist" });
    else if(user.user_type != "Studente")
        return res.status(403).json({ success: false, message: "The user in params isn't a student" });            

    //retrieve all datas necessary (time_slot.id, time, day and isntructor) to create a new reservation and save them in an array {temp}
    const temp = []; 
    var index = 0;
    let workshifts = await Workshift.find({}).exec();      
    workshifts.forEach(element =>  { 
        element.time_slots.forEach((type)=>{
            temp[index++] = new reservationDB(null, type._id, type, element.date, element.instructor);
        })
    });

    //check if slotID exist in time_slots of availabilities
    let check = false;        //var to check if there is a corresponding id between slotID in body and one id of all reservations
    let reservationTrue;      //var to save the new reservation
    index = 0;
    for(var i=0;i<temp.length && check==false ;i++){
        var str = req.body.slotID.toString();
        if(str==temp[i].id.toString()){
            reservationTrue = new reservationDB(req.params.id.toString(),temp[i].id,temp[i].time, temp[i].date, temp[i].instructor);  
            check = true;
        }  
    }
    if(check==false)    //if slotID does not exist return a message
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
        if(idOfReseravions[i]==(req.body.slotID.toString())){
            return res.status(491).json({success: false, nessage: "Reservation already made"});
        }
    }

    //save the reservation
    let newReservation = new Reservation({
        instructor: new ObjectId (reservationTrue.instructor),
        student: new ObjectId (reservationTrue.student),
        time_slot: {
            id: new ObjectId(reservationTrue.id),
            date: reservationTrue.date,
            start_time: reservationTrue.time
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
    
   
    //retrieve all datas necessary (time_slot.id, time, day and isntructor) to create a new reservation and save them in an array {temp}
    const temp = [];
    let index = 0;
    let allWorkshiftReservation = await Workshift.find({}).exec();
    allWorkshiftReservation.forEach((element) =>{
        element.time_slots.forEach((type)=>{
                temp[index++] = new reservationDB(null,type._id,type,element.date,element.instructor);

        })
    })

    //check if idSlot already exists in reservations
    let idRes = await Reservation.find( { } ).exec();
    var idOfReseravions = [];   //arr of all id reservations
    var idOfInstructor = [];    //array of all id instrctor in reservation
    index = 0;
    var count = 0;
    idRes.forEach(element => {
        idOfInstructor[count++]=element.instructor.toString();
        idOfReseravions[index++]=element.time_slot.id.toString();

    });
    
    //create an array with all free time_slots
    const freeReservation = [];
    index = 0;
    for(var i=0;i<temp.length;i++){
        if(idOfReseravions.indexOf(temp[i].toString())== -1)    //check if id of time_Slots in availabilities exist in a reservation
            freeReservation[index++] = new reservationDB(null, temp[i].id, temp[i].time, temp[i].date, temp[i].instructor);
    }

    let reservation = await Reservation.find({ student: req.params.id }).exec();
    //check if there are workshifts for that student
    if (reservation.length == 0)
        return res.status(209).json({ success: true, message: "There are no reservation of this student", freeReservation: freeReservation });
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

    return res.status(200).json({success: true, message: "OK", result: result});
    
}

exports.delete = async(req, res) => {
   
    let reservation = await Reservation.findByIdAndRemove(req.params.id).exec();
    //check if the workshift exist
    if (!reservation)
        return res.status(400).json({ success: false, message: "The reservation does not exist" })

    return res.status(200).json({ success: true, messagge: "Cancellation done" });
}


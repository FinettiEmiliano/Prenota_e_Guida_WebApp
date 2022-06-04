const Workshift = require('../models/availability.model'); // get out availability model
const User = require('../models/user.model'); // get out user model
const Reservation = require('../models/reservation.model'); // get out reservation model
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
            reservation[index++]=temp[i+1].toString(); //id 
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
    return res.status(201).json({success: true, message: "Reservation done"});
}

exports.findAll = async (req,res) =>{

    //check if id in params is correct
    let user = await User.findById(req.params.id).exec();
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
                temp[index++]=type._id;
                temp[index++]=element.date;
                temp[index++]=type;
        })
    })

    //check if idSlot already exists in reservations
    //arr = array degli id delle riservations
    let idRes = await Reservation.find( { } ).exec();
    var arr = [];
    index = 0;
    idRes.forEach(element => {
            arr[index++]=element.time_slot.id.toString();
    });
    
    //create an array with all free time_slots (id, date, time)
    const freeReservation = [];
    index = 0;
    for(var i=0;i<temp.length;i+=3){
        if(arr.indexOf(temp[i].toString())== -1){
            freeReservation[index++]=temp[i];
            freeReservation[index++]=temp[i+1];
            freeReservation[index++]=temp[i+2];
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


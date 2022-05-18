
//---------------------Funzioni utili per API---------------------
//funzione per inserire un documento all'interno dello schema dato un obj (di tipo MoldeUtente?)
const insertUser = async(obj)=>{
    const user = new ModelUtente(obj);
    await user.save();
    //console.log("Utente inserito");
}

//funzione per cercare un utente dal username dato il nameutente
const seachUser = async(usr)=>{ //usr -> name utente come parametro
    const user = await ModelUtente.findOne({username: usr});
    console.log("Utente trovato:" +user);
}

//funzione per controllare se esiste un utente con determinati username e password
const checkLogin = async(usr,ps)=>{
    const user = await ModelUtente.findOne({username: usr});
    if(user==null)
        console.log("Non esiste nessun "+ usr);
    else{
        if(user.password == ps)
            console.log("Credenziali corrette di "+ usr);
        else
            console.log("Credenziali errate");
    }
}

//funzione per eliminare un utente dato un obj (di tipo ModelUtente?) 
const deleteUtente = async(usr)=>{
    var bool = await ModelUtente.exists({username: usr});
    if(bool){
        const user = await ModelUtente.deleteOne({username: usr});
        console.log("Utente eliminato");
    }
    else
        console.log("Non esiste tale Utente");
}

/*
require("dotenv").config()  //forse non va qua ma se non lo metto non funziona, serve per l'URL contenuto in .env
//URL: mongodb+srv://User_utentiDB:<password>@utentidb.g39cb.mongodb.net/?retryWrites=true&w=majority

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true});    //connessione al DB


// collezione / tabella di utenti
const utentiSchema = new mongoose.Schema({      
    username: String, 
    password: String,
    user_type: String,    //sarebbe enum
    name: String,
    surname: String,
    photo: String            // come??
});

const ModelUtente = mongoose.model("Users", utentiSchema);  

//inserimento a mano
insertUser({
    username: 'Emi', 
    password: 'pollo00',
    user_type: 'Istruttore',    //sarebbe enum
    name: 'Mario',
    surname: 'Draghi',
    photo: 'pathphoto'                // come??
})

//creazione di un Utente

const Persona = new ModelUtente({
    username: 'DiegoARRONDO',
    password: 'Cavallo00',
    user_type: 'Istruttore',    //sarebbe enum
    name: 'Luca',
    surname: 'Abbelli',
    photo: 'pathphoto' // come??
})
*/





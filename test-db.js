const mongoose = require("mongoose");
mongoose.connect('mongodb+srv://User_utentiDB:Mandarino06@utentidb.g39cb.mongodb.net/?retryWrites=true&w=majority');    //connessione al DB

// collezione / tabella di utenti
const utentiSchema = new mongoose.Schema({      
    nome_utente: String, 
    password: String,
    tipo_utente: String,    //sarebbe enum
    nome: String,
    cognome: String,
    foto: String // come??
});


const ModelUtente = mongoose.model("Utenti", utentiSchema);  



//funzione per inserire un documento (?) all'interno dello schema
const insertUser = async(obj)=>{
    const user = new ModelUtente(obj);
    await user.save();
    //console.log("Utente inserito");
}



//funzione per cercare un utente dal nome_utente
const seachUser = async(usr)=>{ //usr -> nome utente come parametro
    const user = await ModelUtente.findOne({nome_utente: usr});
    console.log("Utente trovato:" +user);
}

//inserimento a mano
insertUser({
    nome_utente: 'MarioDraghi', 
    password: 'mandarino00',
    tipo_utente: 'Istruttore',    //sarebbe enum
    nome: 'Mario',
    cognome: 'Draghi',
    foto: 'pathFoto' // come??
})


const Persona = new ModelUtente({
    nome_utente: 'LucaAbbelli',
    password: 'Cavallo00',
    tipo_utente: 'Istruttore',    //sarebbe enum
    nome: 'Luca',
    cognome: 'Abbelli',
    foto: 'pathFoto' // come??
})

//inserimento per copia
//insertUser(Persona);
//deleteUser("MarioDraghi");
seachUser("MarioDraghi");


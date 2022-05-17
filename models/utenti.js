var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const Tipo_utente = {
    ISTRUTTORE: ,
    STUDENTE: 2,
    AMMINISTRATORE: 3
}

module.export = mongoose.model("Utenti", new Schema({
    nome_utente: String, 
    password: String,
    tipo_utente: {type: Tipo_utente} ,    //sarebbe enum
    nome: String,
    cognome: String,
    foto: String // come??
}));
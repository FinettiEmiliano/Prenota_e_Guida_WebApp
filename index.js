//----------------------file di configurazione per il collegamento al database----------------------
const mongoose = require('mongoose');
 
//const port = process.env.PORT || 8080

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}) ;   //connessione al DB
/*----------------------QUESTO NON CI DOVREBBE ESSERE, BISOGNA SETTARE LA PORTA----------------------
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});
*/
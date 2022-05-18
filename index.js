//----------------------file di configurazione per il collegamento al database----------------------
require('dotenv').config();
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;

module.exports = mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}) //connection to DB
.then ( () => {
    
    console.log("Connected to Database");
    
    /*
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });*/
    
});
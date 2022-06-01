const figlet = require("figlet");
const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config({ path: '.env' });

figlet('Prenota e Guida', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

// parse request using express
app.use(express.json());
app.use(cors());

app.use('/', express.static(process.env.FRONTEND || 'static/loginPage'));

require("./app/routes/router")(app);
let port = process.env.PORT || 8080
//server listening----------------------------------------------------
if(process.env.NODE_ENV != 'test'){
    app.listen(port, () => {
        console.log(`Server is running on port ` + process.env.PORT + `.`);
    });
}
//--------------------------------------------------------------------

//connection to database----------------------------------------------
const db = require("./app/models/db.model");
db.mongoose
    .connect(db.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {   
        console.log("Connected to the database!");
    })
    .catch(err => {
        console.log("Cannot connect to the database!", err);
        process.exit();
    });
//--------------------------------------------------------------------

module.exports = app;
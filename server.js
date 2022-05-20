const express = require("express");
const cors = require("cors");
const app = express();
require('dotenv').config({ path: '.env' });


// parse request using express
app.use(express.json());
app.use(cors());

app.use('/', express.static(process.env.FRONTEND || 'static/loginPage'));

require("./app/routes/authentication.route")(app);

//server listening----------------------------------------------------
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ` + process.env.PORT + `.`);
});
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
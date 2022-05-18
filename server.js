const express = require("express");
//const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
require('dotenv').config({ path: './.env' });

var corsOptions = {
    origin: "http://localhost:8081"
};

// parse request using express
app.use(express.json());

//app.use(cors(corsOptions));
app.use(cors());

app.get("/", (req, res) => {
    res.json({ message: "Welcome to Prenota e Guida application." });
});
require("./app/routes/authToken.route")(app);
// set port, listen for requests
//const PORT = process.env.PORT|| 8080;
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ` + process.env.PORT + `.`);
});

const db = require("./app/models/config.model");
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
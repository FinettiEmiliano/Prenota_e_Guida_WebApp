//const dbConfig = require("../config/db.config");
const mongoose = require("mongoose");
//require('dotenv').config({ path: '../../.env' });
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_URL;

db.user = require("./user.model.js")(mongoose);
module.exports = db;
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.Schema.Types.String.checkRequired(v => typeof v === 'string');

const db = {};
db.mongoose = mongoose;
db.url = process.env.DB_URL;
db.user = require("./user.model.js")(mongoose);
db.availability = require("./availability.model")(mongoose);
module.exports = db;
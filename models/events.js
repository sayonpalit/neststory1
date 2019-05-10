var mongoose = require("mongoose");

var newsSchema = new mongoose.Schema({
    title: String,
    attendees:String,
    venue:String,
    body: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("News",newsSchema);
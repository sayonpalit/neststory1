var mongoose = require("mongoose");

var newsSchema = new mongoose.Schema({
    title: String,
    image: [String],
    video:String,
    body: String,
    category:String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("News",newsSchema);
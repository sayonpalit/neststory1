var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    multer         = require("multer"),
    fs             = require("fs"),
    app            = express(),
    jwt            = require("jsonwebtoken");
    

var News =require("./models/news");
var newsRoutes  = require("./routes/news");
var apiRoutes   = require("./routes/index");
// APP CONFIG
mongoose.connect("mongodb://localhost/neststory");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG

app.get("/", function(req, res){
   res.redirect("/news"); 
});

app.use("/news", newsRoutes);
app.use("/api",apiRoutes);
app.listen(3000,function(){
    console.log("SERVER IS RUNNING!");
});

var jwt = require("jsonwebtoken");
var middlewareObj = {};

middlewareObj.verifyToken = function(req,res,next){
//get auth header
//console.log(req.headers);
const bearerHeader = req.headers['authorization'];
// console.log(bearerHeader)
//check if bearer is undefined
    if(typeof bearerHeader !== "undefined"){
        //split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //console.log(`Bearer : ${bearerToken}`);

        //next
        next();
    }else{
        //forbidden
        res.json({success:false,message:"forbidden"});
    }
}

module.exports = middlewareObj;
var express = require("express"),
    router  = express.Router(),
    jwt     = require("jsonwebtoken");
var middleware = require("../middleware/index.js");

router.post("/login",(req,res)=>{
    //Mock admin
    const user = {
        id : 1,
        username:'admin',
        email : 'admin@gmail.com'
    }
    jwt.sign({user:user},'secretkey',{expiresIn: '300s'},(err,token)=>{
        res.json({
            token 
        });
    });
});

module.exports = router;
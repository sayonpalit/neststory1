var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose       = require("mongoose"),
    express        = require("express"),
    multer         = require("multer"),
    News           = require("../models/news");
    router            = express.Router();
var News =require("../models/news");

//==============MEDIA STORAGE============================
var storageImages = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, '../uploads/images')
    },
    filename: function (req, file, cb) {
        let ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
var storageVideos = multer.diskStorage({
    destination: function (req, file, cb) {

        cb(null, '../uploads/videos')
    },
    filename: function (req, file, cb) {
        let ext = ''; // set default extension (if any)
        if (file.originalname.split(".").length>1) // checking if there is an extension or not.
            ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
        cb(null, Date.now() + ext)
    }
})
const uploadImages = multer({storage:storageImages});
const uploadVideos = multer({storage:storageVideos});
router.post('/:id/uploadVideo', uploadVideos.single('myFile'), (req, res) => {
    if (req.file) {
        var filename = req.file.filename;
        var uploadStatus = 'File Uploaded Successfully';
        var vidPath =   req.file.path;
    } else {
        var filename = 'FILE NOT UPLOADED';
        var uploadStatus = 'File Upload Failed';
    }
    
    /* ===== Add the function to save filename to database ===== */
    
    News.findById(req.params.id, function(err, foundNews){
        console.log(req.params.id);
        if(uploadStatus!=="File Uploaded Successfully"){
            return res.json({success:false,error:err});
        }
        else{
            foundNews.video = vidPath;
            foundNews.save(function (err) {
                if (err) {
                  return res.json({error:err});
                }
                //Respond to request indicating the user was created
            
                res.json({success: true,news:foundNews});
              })
        }
    });
    
});

//IMAGE UPLOAD ROUTE DEFINITION
router.post('/:id/uploadImage', uploadImages.single('myFile'), (req, res) => {
    if (req.file) {
        var uploadStatus = 'File Uploaded Successfully';
        var imgPath = req.file.path;
    } else {
        console.log('No File Uploaded');
        var filename = 'FILE NOT UPLOADED';
        var uploadStatus = 'File Upload Failed';
    }
    
    /* ===== Add the function to save filename to database ===== */
    
    News.findById(req.params.id, function(err, foundNews){
        console.log(req.params.id);
        if(uploadStatus!=="File Uploaded Successfully"){
            return res.json({success:false,error:err});
        }
        else{
            console.log(foundNews)
            foundNews.image.push(imgPath);
            foundNews.save(function (err) {
                if (err) {
                  return res.json({error:err});
                }
                //Respond to request indicating the user was created
            
                res.json({success: true,news:foundNews});
              })
        }
    });
    
});

//different category news
router.get("/category",function(req,res){
    console.log(req.body.category);
    News.find({category:req.body.category},'title image category created body',function(err,docs){
        if(err){
            console.log(err);
            return res.json({success:false,error:err});
        }
        else{
            console.log(docs);
            return res.json({success:true,data:docs});
        }
    });
});

// INDEX ROUTE
router.get("/", function(req, res){
   News.find({}, function(err, news){
       if(err){
           console.log("ERROR!");
           return res.json({success:false,error:err});
       } else {
            return res.json({ success: true, data: news }); 
       }
   });
});

// CREATE ROUTE
router.post("/", (req, res, next)=>{
    // create blog
    const title = req.body.title;
    const body = req.body.body;
    const category = req.body.category;
    if (!title && !image && !body && !category) {
        return res.status(422).send({error: 'You must provide title, categories, content'})
      }
    const NewPost = new News({
        title: title,
        body : body,
        category : category
      })
      NewPost.save(function (err) {
        if (err) {
          return next(err)
        }
        //Respond to request indicating the user was created
    
        res.json({success: true})
      })
});

// SHOW ROUTE
router.get("/:id", function(req, res){
   News.findById(req.params.id, function(err, foundNews){
       if(err){
            return res.json({success:false,error:err});
       } else {
            return res.json({ success: true, data: foundNews }); 
       }
   })
});

// EDIT ROUTE
router.get("/:id/edit", function(req, res){
    News.findById(req.params.id, function(err, foundNews){
        if(err){
            return res.json({success: false,data:null});
        } else {
            return res.json({ success: true, data: foundNews });
        }
    });
})


// UPDATE ROUTE
router.put("/:id", function(req, res){
    req.body.news.body = req.sanitize(req.body.news.body)
   News.findByIdAndUpdate(req.params.id, req.body.news, function(err, updatedNews){
      if(err){
          res.redirect("/news");
      }  else {
          res.redirect("/news/" + req.params.id);
      }
   });
});

// DELETE ROUTE
router.delete("/:id", function(req, res){
   //destroy blog
   News.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/news");
       } else {
           res.redirect("/news");
       }
   })
   //redirect somewhere
});

module.exports = router;
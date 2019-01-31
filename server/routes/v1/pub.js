const express = require('express');
const server = express();

const router = express.Router();

const functions = require('functions'),
    controllers = require('controllers');

const pubController = controllers.pubs;

const models = require('models');
const sequelize = models.sequelize;


var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


async function checkPubOwnership(req,res,next){
 if(req.isAuthenticated()){
    var pub = await sequelize.query("select * from pubs where id ="+req.params.id, {type: sequelize.QueryTypes.SELECT});
    pub = pub[0]; 
    if(!pub){
      req.flash("error","pub does not exist");
      res.redirect("back");
    }else{
      if(pub.userId === (req.user.id)){
        next();
      }
      else{
        req.flash("error","You don't have the permission to do that!!");
        res.redirect("back");
      }
    }

  }else{
    req.flash("error","You need to be logged in to do that!!!");
    res.redirect("back");
  }   
}



//ROUTES

router.route('/create')
  .post(upload.single('image'),pubController.create);

router.route('/edit/:id')
  .post(upload.single('image'),checkPubOwnership,pubController.edit);


server.use('/', router);

module.exports = server;
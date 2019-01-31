const Promise = require('bluebird');
const config = require('config');
const functions = require('functions');
const models = require('models');
const sequelize = models.sequelize;
var NodeGeocoder = require('node-geocoder');

var options = {
	provider: 'google',
	httpAdapter: 'https',
	apiKey: 'AIzaSyCVHp-sceFLnk_-XuuvEhZX9VytMb2blVc',
	formatter: null
};

var geocoder = NodeGeocoder(options);

const pubs = models.pub;

var cloudinary = require('cloudinary');
cloudinary.config({ 
	cloud_name: 'dskmn0vwa', 
	api_key:"943622486141547", 
	api_secret:"klX-ayutXqmxdZUmtL9bXhTQbro"
});

module.exports = {
	create: async function (req, res) {
		try{
			
			//query maadi to get the user associated 
			var userId = await sequelize.query("select id from users where email = "+"'"+req.body.email+"'", {type: sequelize.QueryTypes.SELECT});
			userId = userId[0].id;

			console.log(req.body.address);
   //===============copied from google api========================           
   geocoder.geocode(req.body.address, function (err, data) {
      //================================================================
      var lat = data[0].latitude;
      var lng = data[0].longitude;
      var location = data[0].formattedAddress;                  
       //===============================================================


       var data1 = {
       	userId:userId,
       	pubName: req.body.name,
       	about:req.body.about,
       	fac1:req.body.fac1,
       	fac2:req.body.fac2,
       	fac3:req.body.fac3,
       	fac4:req.body.fac4,
       	fac5:req.body.fac5,
       	price:req.body.price,
       	pubContact:req.body.pubContact,
       	address:location,
       	lat : lat,
       	lng : lng,
       	createdAt: new Date(),
       	image:req.body.image
       }

       cloudinary.uploader.upload(req.file.path, function(result) {
       	data1.image = result.secure_url;
       	pubs.create(data1).then(newPub=>{
       		res.redirect('/multi');
       	});

       }); 
   });

}catch(error) {
	console.log(error);
}
},
edit: async function (req, res) {
	try{
			 //query maadi to get the user associated 
			 var userId = await sequelize.query("select id from users where email = "+"'"+req.body.email+"'", {type: sequelize.QueryTypes.SELECT});
			 userId = userId[0].id;

			 var data = {
			 	userId:userId,
			 	pubName: req.body.name,
			 	about:req.body.about,
			 	fac1:req.body.fac1,
			 	fac2:req.body.fac2,
			 	fac3:req.body.fac3,
			 	fac4:req.body.fac4,
			 	fac5:req.body.fac5,
			 	price:req.body.price,
			 	pubContact:req.body.pubContact,
			 	address:req.body.address,
			 	createdAt: new Date(),
			 	image:req.body.image
			 }

			 cloudinary.uploader.upload(req.file.path, function(result) {
			 	data.image = result.secure_url;
			 	pubs.update(data,{where:{userId:userId}}).then(newPub=>{
			 		res.redirect('/multi');
			 	});

			 });

			}catch(error) {
				console.log(error);
			}
		}
	}



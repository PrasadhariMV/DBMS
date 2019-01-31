const Promise = require('bluebird');
const config = require('config');
const functions = require('functions');
const models = require('models');
const sequelize = models.sequelize;

const comments = models.comment;


module.exports = {
	create: async function (req, res) {
		try{
			
			//query maadi to get the user associated 
			// var userId = await sequelize.query("select id from users where email = "+"'"+req.body.email+"'", {type: sequelize.QueryTypes.SELECT});
			// userId = userId[0].id;

            var pubId = await sequelize.query("select id from pubs where pubName = "+"'"+req.body.pubName+"'", {type: sequelize.QueryTypes.SELECT});
			userId = userId[0].id;

			var data = {
				//userId:userId,
				userId:req.user.id,
				pubId:pubId,
				content:req.body.content,
				createdAt: new Date(),
				updatedAt: new Date()
			}

			comments.create(data).then(newPub=>{
				      req.flash("success","comment added successfully");
                      res.redirect('/multi');
				});
		}catch(error) {
			console.log(error);
		}
	}
	// edit: async function (req, res) {
	// 	try{
	// 		 //query maadi to get the user associated 
	// 		var userId = await sequelize.query("select id from users where email = "+"'"+req.body.email+"'", {type: sequelize.QueryTypes.SELECT});
	// 		userId = userId[0].id;

	// 		var data = {
	// 			userId:userId,
	// 			pubName: req.body.name,
	// 			about:req.body.about,
	// 			fac1:req.body.fac1,
	// 			fac2:req.body.fac2,
	// 			fac3:req.body.fac3,
	// 			fac4:req.body.fac4,
	// 			fac5:req.body.fac5,
	// 			price:req.body.price,
	// 			pubContact:req.body.pubContact,
	// 			address:req.body.address,
	// 			createdAt: new Date(),
	// 			image:req.body.image
	// 		}

	// 		cloudinary.uploader.upload(req.file.path, function(result) {
	// 			data.image = result.secure_url;
	// 			pubs.update(data,{where:{userId:userId}}).then(newPub=>{
 //                      res.redirect('/multi');
	// 			});

	// 		});

	// 	}catch(error) {
	// 		console.log(error);
	// 	}
	// }
}



//APP CONFIG
var  express        = require("express")
, app            = express()
, bodyParser     = require("body-parser")
, config         = require('config')
, functions      = require('functions')
, methodOverride = require("method-override")
, models         = require('models')
, routes         = require('routes')
, flash          = require("connect-flash")
, cors           = require('cors')
, passport       = require('passport')
, geocoder       = require("geocoder")
, session        = require('express-session');


const sequelize = models.sequelize;

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json({limit: "50mb"}));
app.use(flash());

// set up app views handling
app.set('view engine', 'ejs');


// Passport config
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./passport.js')(passport, models.user);

//our own middleware to add current user to all the pages
app.use(function(req,res,next){
 res.locals.currentUser = req.user; 
 res.locals.error = req.flash("error");
 res.locals.success = req.flash("success");
   next();  //very imp as it is a middleware it requires next operation
 });



// load up app routes
app.get(['/landing','/'], function(req,res){
  res.render('landing');
});

app.get('/login', function(req,res){ 
 res.render('login');
});

app.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true,
  successFlash: 'Welcome to payme'
}),function(req,res){
});


app.post('/register', passport.authenticate('local-signup', {
  successRedirect: '/home',
  failureRedirect: '/login'
} 
));

app.get('/addMoney',function(req,res){
  res.render('add_money');
});


app.get('/addBank',function(req,res){
     res.render('ADD_BANK');
});


app.post('/registerBank',function(req,res){
   console.log(req.body);
  
   var bank = models.bank;

   var data = {
     balance:Math.floor((Math.random() * 100) + 100000),
     accountNumber:req.body.accountNumber,
     bankName:req.body.bankName,
     phoneNumber:req.user.phoneNumber
   }
 
  bank.create(data).then(newBank=>{
   setTimeout(function () {
             res.redirect('/home');
           }, 1500);
  });          
});


app.post('/registerTransaction',async function(req,res){
  // var amount = req.body.amount;
   var userWallet = models.userWallet;
    
   var data ={
     amount:Number(req.body.amount),
     phoneNumber:req.user.phoneNumber,
     type:'add'
   }
   
   var bank = models.bank;

   var currBalance = await sequelize.query("select balance from banks where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
   var newBalance = currBalance[0].balance - Number(req.body.amount);
   var data1={
      balance:newBalance
   }
   console.log(data1);

   bank.update(data1,{where:{phoneNumber:req.user.phoneNumber}}).then(newBank=>{
       console.log(newBank);
    });

   const user = models.user;
   var currWalletBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
   console.log('currWalletBalance',currWalletBalance);
   var newWalletBalance = currWalletBalance[0].wallet + Number(req.body.amount);
   console.log(newWalletBalance);
   const dat = {
                  wallet: newWalletBalance
               }
   await user.update(dat,{where:{phoneNumber:req.user.phoneNumber}}).then(newUser=>{
    });                       

   userWallet.create(data).then(newWallet=>{
          setTimeout(function () {
             res.redirect('/home');
           }, 1500); 
   });
  
   
});

app.get('/sendMoney',function(req,res){
  res.render('send_money')
});


app.post('/registerSendTransaction',async function(req,res){
  console.log(req.body);
  const amount  = req.body.amount;
  const targetPhoneNumber = req.body.targetPhoneNumber;
  
  const loggedInUser = req.user;
  console.log('loggedInUser',loggedInUser);

  flag = await verifyAccount(amount,targetPhoneNumber,loggedInUser);

  if(flag === true){
    console.log('sahi hai');
     
     var wallet = models.userWallet;
     var bank = models.bank;
     var user = models.user; 
     
     //amount deducted from wallet
     var currWalletBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
     if(currWalletBalance[0].wallet>Number(req.body.amount)){
     var newWalletBalance = currWalletBalance[0].wallet - Number(req.body.amount);
     }else{
        res.redirect('/home');    
     }
     var dat={
           wallet:newWalletBalance
          }
     await user.update(dat,{where:{phoneNumber:req.user.phoneNumber}}).then(newUser=>{
         console.log(newUser);
      });

     //amount added to wallet of the other guy
     var currBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+req.body.targetPhoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
     var newBalance = currBalance[0].wallet + Number(req.body.amount);
     var data1={
           wallet:newBalance
          }
     await user.update(data1,{where:{phoneNumber:req.body.targetPhoneNumber}}).then(newUser=>{
         console.log(newUser);
      });

     //wallet add
     var data ={
       amount:Number(req.body.amount),
       phoneNumber:req.user.phoneNumber,
       type:'send'
     }
    
    wallet.create(data).then(newWallet=>{
          setTimeout(function () {
             res.redirect('/home');
           }, 1500); 
     });

  }else{
    console.log('there is some mismatch check properly');
  } 
});



async function verifyAccount(amount,targetPhoneNumber,loggedInUser){
    var user = await sequelize.query("select * from users where phoneNumber = "+"'"+targetPhoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
    console.log(user);
    if(user.length === 0){
      return false;
    }else{
       var walletBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+loggedInUser.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
       walletBalance = walletBalance[0].wallet;
       if(walletBalance>=Number(amount)){
         return true;
       }else{
         return false;
       }
    }
}



app.get('/recharge',function(req,res){
   res.render('recharge');
});


app.post('/registerRecharge',async function(req,res){
   const amount = req.body.amount;
   const loggedInUser = req.user;
   const flag = await verification(amount,loggedInUser);
    if(flag === true){
     var wallet = models.userWallet;
     var bank = models.bank;
     var user = models.user; 
     var recharge = models.recharge;
     
     //amount deducted from wallet
     var currWalletBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
     if(currWalletBalance[0].wallet>Number(req.body.amount)){
     var newWalletBalance = currWalletBalance[0].wallet - Number(req.body.amount);
     }else{
        res.redirect('/home');    
     }
     var dat={
           wallet:newWalletBalance
          }
     await user.update(dat,{where:{phoneNumber:req.user.phoneNumber}}).then(newUser=>{
         console.log(newUser);
      });

     //insert into recharge table
     var data = {
        plan:req.body.plan,
        amount:req.body.amount,
        phoneNumber:req.user.phoneNumber,
        operator:req.body.operator,
        rechargedNumber:req.body.rechargedNumber
     }

    recharge.create(data).then(newRecharge=>{
          setTimeout(function () {
             res.redirect('/home');
           }, 1500); 
     });


    }else{
        console.log('mismatch occured');
    }
});

async function verification(amount,loggedInUser){
  var walletBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+loggedInUser.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
       walletBalance = walletBalance[0].wallet;
       if(walletBalance>=Number(amount)){
         return true;
       }else{
         return false;
       }
}

app.get('/bookBus',function(req,res){
   res.render('BUS-BOOK');
});

app.post('/registerBookedBus',async function(req,res){
   
  const bookBus = models.bookBus;
  const user = models.user;

   const data = {
      amount:req.body.amount,
      phoneNumber:req.user.phoneNumber,
      busId:req.body.busId
   }

    //amount deducted from wallet
     var currWalletBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
     if(currWalletBalance[0].wallet>Number(req.body.amount)){
     var newWalletBalance = currWalletBalance[0].wallet - Number(req.body.amount);
     }else{
        res.redirect('/home');    
     }
     var dat={
           wallet:newWalletBalance
          }
     await user.update(dat,{where:{phoneNumber:req.user.phoneNumber}}).then(newUser=>{
         console.log(newUser);
      });

     //transaction record

      bookBus.create(data).then(newbookBus=>{
          setTimeout(function () {
             res.redirect('/home');
           }, 1500); 
     });


   console.log(req.body);
});


app.get('/bookMovie',function(req,res){
   res.render('movie_page');
});

app.post('/registerBookedMovie',async function(req,res){
   
  const bookMovie = models.bookMovie;
  const user = models.user;

   const data = {
      amount:req.body.amount,
      phoneNumber:req.user.phoneNumber,
      movieId:req.body.movieId,
      movieName:req.body.movieName
   }

    //amount deducted from wallet
     var currWalletBalance = await sequelize.query("select wallet from users where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
     if(currWalletBalance[0].wallet>Number(req.body.amount)){
     var newWalletBalance = currWalletBalance[0].wallet - Number(req.body.amount);
     }else{
        res.redirect('/home');    
     }
     var dat={
           wallet:newWalletBalance
          }
     await user.update(dat,{where:{phoneNumber:req.user.phoneNumber}}).then(newUser=>{
         console.log(newUser);
      });

     //transaction record

      bookMovie.create(data).then(newbookBus=>{
          setTimeout(function () {
             res.redirect('/home');
           }, 1500); 
     });


   console.log(req.body);
});




var templateArray = ["avengers","bigHero6","forrestGump","incredibles2","interstellar","lifeOfPi","pursuitOfHappyness","shawshankRedemption","starWars","darkKnightRises","abtus"];

templateArray.forEach(template =>{
    app.get('/'+template,function(req,res){
        res.render(template);
    });
});


app.get('/profile',async function(req,res){
    var userWallet = await sequelize.query("select * from userWallets where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
    var recharge = await sequelize.query("select * from recharges where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
    var bookMovie = await sequelize.query("select * from bookMovies where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
    var bookBus = await sequelize.query("select * from bookBuses where phoneNumber = "+"'"+req.user.phoneNumber+"'", {type: sequelize.QueryTypes.SELECT});
    
    var data = {
       userWallet:userWallet,
       recharge:recharge,
       bookMovie:bookMovie,
       bookBus:bookBus,
    }
   console.log(userWallet,recharge,bookMovie,bookBus);

   res.render('PROFILE',{data:data});
});



app.get('/home',isLoggedIn,function(req,res){
   res.render('homepage');
});


app.get("/delete",async function(req,res){
  const phNo = req.user.phoneNumber;
  await req.logout();
  await sequelize.query("delete from users where phoneNumber = "+"'"+phNo+"'", {type: sequelize.QueryTypes.DELETE});
  res.redirect('/');
});



app.get("/logout",function(req,res){
  req.logout();
  req.flash("success","logged you out!!");
  res.redirect("/landing");
});


//**************************************
//middlewares
//**************************************
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
   return next();
 }
 res.redirect('/login');
}




require('routes').forEach(function (a) {
 app.use(a.prefix, a.server);
});

app.listen(7000,function(){
 console.log("payme has started");
});



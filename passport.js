module.exports = function(passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
    var bCrypt = require('bcrypt-nodejs');

   //serialize
   passport.serializeUser(function(user, done) {
    done(null, user.phoneNumber);
});

   // deserialize user 
   passport.deserializeUser(function(id, done) {   
    User.findById(id).then(function(user) {
        if (user) {
            done(null, user.get());
        } else {
            done(user.errors, null);
        }
    });
});

    //signup
    passport.use('local-signup', new LocalStrategy(
    {
        usernameField: 'email', 
        passwordField: 'password',
        passReqToCallback: true 
    },
    function(req, email, password, done) {
        //hashing the password
        var generateHash = function(password) {
            return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
        };

        User.findOne({
            where: {
                email: email
            }
        }).then(function(user) {
            if (user)
            {
                 //res.flash("error",'That email is already taken');
                return done(null, false ,{
                    message: 'That email is already taken'
                });
            } else{
             var userPassword = generateHash(password);
             var data =
             {
                email: email,
                password: userPassword,
                name:req.body.name,
                phoneNumber:req.body.phoneNumber,
                wallet:0
            };
            User.create(data).then(function(newUser, created) {
                if (!newUser) {
                    return done(null, false);
                }
                if (newUser) {
                    req.flash("success","Welcome to clubbo "+newUser.name);
                    return done(null, newUser);
                }

            });

        }

    });

    }
    ));


    //login
    passport.use('local-signin', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true 
    },
    function(req, email, password, done) {
        var User = user;
        var isValidPassword = function(userpass, password) {
         return bCrypt.compareSync(password, userpass);
     }
     User.findOne({
        where: {
            email: email
        }
    }).then(function(user) {
        if (!user) {
            res.flash("error",'Email does not exist');
            return done(null, false, {
                message: 'Email does not exist'
            });
        }
        if (!isValidPassword(user.password, password)) {
            res.flash("error",'Incorrect password.');
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }
        var userinfo = user.get();
        return done(null, userinfo);
    }).catch(function(err) {
        console.log("Error:", err);
        return done(null, false);
    });
}
));

}
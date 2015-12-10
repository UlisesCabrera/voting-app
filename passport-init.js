//fb requirements
var FacebookStrategy = require("passport-facebook").Strategy;
var fbConfig = require("./auths/fb");

// twitter requirements
var TwitterStrategy = require("passport-twitter").Strategy;

var bCrypt = require('bcrypt-nodejs');

//database
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		// tell passport which id to use for user
		console.log('serializing user: ', user._id);
		return done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		// return user object back
		User.findById(id, function(err, user){
			
			if (err) {
				return done (err, false);
			}
			
			if (!user) {
				return done ('user not found', false);
			};
			console.log('Derializing user: ', user._id);									
			return done(null, user);
			
		}) 

	});


passport.use('facebook', new FacebookStrategy({
  clientID        : fbConfig.appID,
  clientSecret    : fbConfig.appSecret,
  callbackURL     : fbConfig.callbackUrl
},
 
  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {
    
    console.log(profile);
    // asynchronous
    process.nextTick(function() {
     
      // find the user in the database based on their facebook id
      User.findOne({ 'username' : profile.displayName }, function(err, user) {
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
          	
            // if there is no user found with that facebook id, create them
            var user = new User();
 			user.username = profile.displayName;
 			user.password = profile.id;
            // set all of the facebook information in our user model

 
            // save our user to the database
            user.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, user);
            });
         } 
      });
    });
}));

passport.use('facebook', new FacebookStrategy({
  clientID        : fbConfig.appID,
  clientSecret    : fbConfig.appSecret,
  callbackURL     : fbConfig.callbackUrl
},
 
  // facebook will send back the tokens and profile
  function(access_token, refresh_token, profile, done) {
    
    console.log(profile);
    // asynchronous
    process.nextTick(function() {
     
      // find the user in the database based on their facebook id
      User.findOne({ 'username' : profile.displayName }, function(err, user) {
 
        // if there is an error, stop everything and return that
        // ie an error connecting to the database
        if (err)
          return done(err);
 
          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {
          	
            // if there is no user found with that facebook id, create them
            var user = new User();
 			user.username = profile.displayName;
 			user.password = profile.id;
            // set all of the facebook information in our user model

 
            // save our user to the database
            user.save(function(err) {
              if (err)
                throw err;
 
              // if successful, return the new user
              return done(null, user);
            });
         } 
      });
    });
}));	
	
	
	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
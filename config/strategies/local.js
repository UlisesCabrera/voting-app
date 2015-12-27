var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function (passport) {

	passport.use('login', new LocalStrategy({
		passReqToCallback: true
	},
		function (req, username, password, done) {

			User.findOne({ username: username }, function (err, user) {

				if (err) {
					return done(err, false);
				}				
 				
				//if there is no user with this username
				if (!user) {
					console.log('User Not Found with username' +  username);
					return done(null, false);
				};
 				
				// check if the password is correct
				if (!isValidPassword(user, password)) {
					console.log('Invalid Password');
					return done(null, false); // redirect back to login page
				};
 				
				// successfully signed in
				console.log('successfully signed in');
				return done(null, user);

			});
		}
		));

	passport.use('signup', new LocalStrategy({
		passReqToCallback: true // allows us to pass back the entire request to the callback
	},
			function (req, username, password, done) {
				User.findOne({ username: username }, function (err, user) {
					// Stage 1 : check if user exists
					if (err) {
						console.log('Error in SignUp: ' + err);
						return done(err);
					} else {
						// we have already signed this user up
						if (user) {
							console.log('User already exists with username: ' + username);
							return done(null, false);
							// Stage 2: creates new user based on User schema
						} else {
							User.findOne({email: req.body.email}, function(err, email) {
								if (err){
									console.log('Error in SignUp: ' + err);
									return done(err);							
								} else {
									if (email){
										console.log('User already exists with email: ' + req.body.email);
										return done(null, false);	
									} else {
										var user = new User();
										user.username = username;
										user.password = createHash(password);
										user.email = req.body.email;
											// stage 3: check if email exists
											User.findOne({email : user.email}, function(err, email){
												if (err) {
													console.log('Error finding the email: ' + err);
													return done(err);
												} else {
													// we have already signed a user with this email
													if (email) {
														console.log('User already exists with email ' + email);
														return done(null, false);
													} else {
														// stage 4: save user to db
														user.save(function (err, user) {
															if (err) {
																console.log('Error in Saving user: ' +  err);
																return done(null, false)
															} else {
																console.log("sucessfully signed up user " + user.username);
																return done(null, user)	
															}
														});
													}
												}
											});								
										} 
									}
								});

							

						}					
					}
				});
			})
		);

	var isValidPassword = function (user, password) {
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function (password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

}; 

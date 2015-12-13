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
				if (err) {
					console.log('Error in SignUp: ' + err);
					return done(err);
				}
 				
				// we have already signed this user up
				if (user) {

					console.log('User already exists with username: ');
					return done(null, false);
				}
 				
				// creates new user based on User schema
				var user = new User();
				console.log(req.body.email);
				user.username = username;
				user.password = createHash(password);
				user.email = req.body.email;


				user.save(function (err, user) {
					if (err) {
						console.log('Error in Saving user: ' +  err);
						throw err;
					}
					console.log(" sucessfully signed up user " + user.username);
				});

				return done(null, user)

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

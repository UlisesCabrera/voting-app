var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');
// Generates hash using bCrypt
var createHash = function (password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

exports.checkUserState = function(req, res){
	// sends response back to client depending if there is 
	// a passport user attached to the request object.
	if (req.user){
		res.send({state:'success'});
	} else {
		res.send({state:'failure'});	
	}
};

exports.failure = function(req, res){
	// when this route is requested send failure state to client
	res.send({state: 'failure', user: null});
};

exports.socialLoginLogic = {
	// if success go to home page, if not stay at login '#' angular view
		 successRedirect: '/',
         failureRedirect: '/#login'
};

exports.localLoginLogic  = {
	// if success go to home page, if not redirect to failure route 
	// which will send failure state to client.
		successRedirect: '/',
		failureRedirect: '/auth/failure'
}

exports.findUserWithEmail = function(req, res){
		// stage 1 =  declare query variable with email from the req object.
	 	var query = { email : req.body.email };
	 	// stage 2 = find user using the query
	 	User.findOne(query, function(err, user){
	 		if (err) {
	 			console.log('error finding user with email ' + req.body.email )
			} else {
				// stage 3: if not errs, check if user was found, send user if found
				// if not, send state failure back to client
		 		if (user) {
		 			res.send({ user : user});
		 		} else {
		 			res.send({state: 'failure', user: null})
		 		}
	 		}
		});
}

exports.updatePassword = function(req, res){
		// stage 1 =  declare query variable with username from the req object.
	 	var query = { username : req.body.username };
	 	// stage 2 = find and update user password using the query
	 	User.findOneAndUpdate(query, { $set: { password: createHash(req.body.password)} }, function(err, user){
	 		if (err) {
	 			console.log('error finding and updating password ' + err);
	 		} else {
	 			// stage 3: if not errs, check if user was found, send user if found
				// with password updated.  if not, send state failure back to client
	 			if (user) {
	 				res.send({ user : user });	
	 			} else {
	 				res.send({state: 'failure', user: null})
	 			}
	 		}  
    	})
};

exports.logout = function(req, res) {
	// only works if there an actual user logged in.
	if (req.user) {
		req.logout();
		res.redirect('/');
	}
}
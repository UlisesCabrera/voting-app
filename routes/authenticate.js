var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bCrypt = require('bcrypt-nodejs');

var successFailureRedirects = { 
		 successRedirect: '/',
         failureRedirect: '/#login'
};

var localFailureSuccessRedirects = {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
}

module.exports = function(passport){
	
	//sends successful login state back to angular
	router.get('/failure', function(req, res){
		res.send({state: 'failure', user: null});
	});
	
	//sends successful login state back to angular
	router.get('/success', function(req, res){
		res.send({state: 'success', user: req.user ? req.user : null});
	});

	//log in local
	router.post('/login', passport.authenticate('login', localFailureSuccessRedirects));

	//sign up local
	router.post('/signup', passport.authenticate('signup', localFailureSuccessRedirects));
	
	// route for twitter authentication and login
	router.get('/twitter', passport.authenticate('twitter'));
	 
	router.get('/twitter/callback', 
	  passport.authenticate('twitter', successFailureRedirects)
	);

	// route for linkedin authentication and login
	router.get('/linkedin', passport.authenticate('linkedin'));
	 
	router.get('/linkedin/callback', 
	  passport.authenticate('linkedin', successFailureRedirects)
	);		
	
	// route for facebook authentication and login
	router.get('/facebook', passport.authenticate('facebook'));
	 
	router.get('/facebook/callback',
	  passport.authenticate('facebook', successFailureRedirects)
	);
	
	// route for github authentication and login
	router.get('/github', passport.authenticate('github'));
	 
	router.get('/github/callback', 
	  passport.authenticate('github', successFailureRedirects)
	);	
	
	// route for google authentication and login
	router.get('/google',
	  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
	
	router.get('/google/callback', 
	  passport.authenticate('google', successFailureRedirects)	
	 );
	 
	 
	router.post('/forgotCredentials', function(req, res){
		// find user by email
	 	var query = { email : req.body.email };
	 	
	 	User.findOne(query, function(err, user){
	 	if (err) {
	 		throw err;
	 	} else {
	 		
	 		// after user is found, send user as response
	 		res.send({ user : user});}
	 	
	    })
	    
	});
	
	router.post('/newPassword', function(req, res){

		// after user is found by email, find it using the username and update the old password.
	 	var query = { username : req.body.username };
	 	// find and update old password, hash password are one way password, cant not be coverted to text after created
	 	// can only be replaced.
	 	User.findOneAndUpdate(query, { $set: { password: createHash(req.body.password)} }, function(err, user){
	 	
	 	if (err) {
	 		throw err;
	 	} else {
	 		
	 		// send user after new password is created.
	 		res.send({ user : user });}
	 	
	    })
	    
	});	
	 
	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});	 
	
	return router;
};

// Generates hash using bCrypt
var createHash = function (password) {
	return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};
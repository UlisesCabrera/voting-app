var express = require('express');
var router = express.Router();
var successFailureRedirects = { 
		 successRedirect: '/',
         failureRedirect: '/#login'
};

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
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up local
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));
	
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
	 
	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});	 
	
	return router;
};
var express = require('express');
var router = express.Router();

module.exports = function(passport){
	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// route for facebook authentication and login
	router.get('/twitter', passport.authenticate('twitter'));
	 
	router.get('/twitter/callback', 
	  passport.authenticate('twitter', { 
		 successRedirect: '/',
         failureRedirect: '/login' 
	  })
	);	
	
	// route for facebook authentication and login
	router.get('/facebook', passport.authenticate('facebook'));
	 
	// handle the callback after facebook has authenticated the user
	router.get('/facebook/callback',
	  passport.authenticate('facebook', {
	    successRedirect : '/',
	    failureRedirect : '/login'
	  })
	);	
	return router;
};
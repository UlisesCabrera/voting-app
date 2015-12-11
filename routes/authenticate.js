var express = require('express');
var router = express.Router();

module.exports = function(passport){
	//log out
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	// route for twitter authentication and login
	router.get('/twitter', passport.authenticate('twitter'));
	 
	router.get('/twitter/callback', 
	  passport.authenticate('twitter', { 
		 successRedirect: '/',
         failureRedirect: '/login' 
	  })
	);

	// route for linkedin authentication and login
	router.get('/linkedin', passport.authenticate('linkedin'));
	 
	router.get('/linkedin/callback', 
	  passport.authenticate('linkedin', { 
		 successRedirect: '/',
         failureRedirect: '/login' 
	  })
	);		
	
	// route for facebook authentication and login
	router.get('/facebook', passport.authenticate('facebook'));
	 
	router.get('/facebook/callback',
	  passport.authenticate('facebook', {
	    successRedirect : '/',
	    failureRedirect : '/login'
	  })
	);
	
	// route for google authentication and login
	router.get('/google',
	  passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' }));
	
	router.get('/google/callback', 
	  passport.authenticate('google', { 
	  	successRedirect : '/',
	    failureRedirect : '/login'
	  })	
	 ); 
	 
	return router;
};
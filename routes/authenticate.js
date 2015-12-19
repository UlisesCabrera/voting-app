var express = require('express');
var router = express.Router();
var authCtrl =  require("../controllers/authenticateController");

module.exports = function(passport){
	
	/*
	*
	* LOCAL AUTH ROUTES 
	*
	*/
	
	//log in local
	router.post('/login', passport.authenticate('login', authCtrl.localLoginLogic));
	//sign up local
	router.post('/signup', passport.authenticate('signup', authCtrl.localLoginLogic));
	// forgot crendetials route, find user name with email provided
	router.post('/forgotCredentials', authCtrl.findUserWithEmail);
	// updates password of user found by email
	router.put('/newPassword', authCtrl.updatePassword);
	
	/*
	*
	* SOCIAL MEDIA AUTH ROUTES 
	*
	*/
	
	// TWITTER
	router.get('/twitter', passport.authenticate('twitter'));
	router.get('/twitter/callback', 
	  passport.authenticate('twitter', authCtrl.socialLoginLogic)
	);

	// LINKEDIN
	router.get('/linkedin', passport.authenticate('linkedin'));
	router.get('/linkedin/callback', 
	  passport.authenticate('linkedin', authCtrl.socialLoginLogic)
	);
	
	// FACEBOOK
	router.get('/facebook', passport.authenticate('facebook'));
	router.get('/facebook/callback',
	  passport.authenticate('facebook', authCtrl.socialLoginLogic)
	);
	
	// GITHUB
	router.get('/github', passport.authenticate('github'));
	router.get('/github/callback', 
	  passport.authenticate('github', authCtrl.socialLoginLogic)
	);
	// GOOGLE
	router.get('/google', passport.authenticate('google', 
		{ scope: 'https://www.googleapis.com/auth/plus.login' }));
	router.get('/google/callback', 
	  passport.authenticate('google', authCtrl.socialLoginLogic)	
	 );
	 
	/*
	*
	* GENERAL USE ROUTES
	*
	*/	 
	 
	//sends failure login state back to angular
	router.get('/failure', authCtrl.failure);
	// will be used by the client to check if the user is logged in.
	router.get('/userState', authCtrl.checkUserState)
	//log out
	router.get('/signout', authCtrl.logout);	 
	
	return router;
};
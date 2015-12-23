angular.module('UserModule', ['UsersService'])
	.controller('UserController',['$scope','$http','$location','UsersSvc','$routeParams', 
	function($scope, $http, $location, UsersSvc, $routeParams){
		// will hold an error message to give feeback to the user
		$scope.error_message = '';
		// will hold user information to be send to the server for authentication.
	    $scope.user = {username: '', password: '', email: ''};
	    	    // gets current user, either temp or signed in
	    $scope.getCurrentUser = function() {
	    	return UsersSvc.user ? UsersSvc.user : null;
	    }; 
	    // used to hide profle, login, and logout info if the user is recovering the password
	    $scope.isGettingNewPassword = function() {
	    	if ($location.url() == '/newPassword'){
	    		return true;
	    	} else {
	    		return false;
	    	}
	    };
	    
	 	// signout for all users (social or local)
	    $scope.signout = function(){
	        UsersSvc.signout()
	        	.then(function(){
		        	UsersSvc.user = null;
	        		$scope.getCurrentUser();
	        		$location.path('/');	
	        	},
	        	function(error) {
	        		$scope.error_message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        	});
	     };
	   /* implementing the login and signup features on angular 
	   *  in order to have more control 
       *  on what to display to the user if anything goes wrong 
	   */
	   $scope.login = function() {
	   	UsersSvc.login($scope.user)
	   		.then(
	   			function(res){
			    	if (res.data.state === "failure") {
			    		$scope.error_message = "Invalid username or password";
		
			    	} else {
			    		// after a succesful login send user to home page,
			    		// and refresh the page with the new user	
			    		$location.path('/');
			    		window.location.reload();
			    	}
	    		}, 
		    	function(error){
		    		$scope.error_message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
		    	}
		    );
	   	};
	   
	   $scope.signup = function() {
	   	UsersSvc.signup($scope.user)
	   		.then(
	   			function(res){
			    	if (res.data.state === "failure") {
			    		$scope.error_message = "User or email already exist";
			    	} else {
			    		// after a succesful signup send user to home page,
			    		// and refresh the page with the new user
			    		$location.path('/');
			    		window.location.reload();
			    	}
	    		},
		    	function(error){
		    		$scope.error_message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
		    	}	    		
	    	);
	   };
	   
	   $scope.forgotCredentials = function() {
		   	UsersSvc.forgotCredentials($scope.user)
		   		.then(
		   			function(res) {
						if (res.data.state === 'failure') {
							$scope.error_message = 'User not Found with email ' + $scope.user.email;
						} else {
							// after user is found by email, ask the user to created a new password
							// set user name to temp user
					   		UsersSvc.user = res.data.user;
					   		$location.path('/newPassword');
						}
		   			},
			    	function(error){
			    		$scope.error_message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
			    	}	    		   			
		   		);
	   };
	   
	   $scope.newPassword = function() {
	   		// assign temp username to user object in order to be used as a query to update password
	   		$scope.user.username = UsersSvc.user.username;
		   	
		   	UsersSvc.newPassword($scope.user)
			   	.then(
			   		function() {
					   	$http.post('/auth/login', $scope.user)
					   		.then(
					   			function(res){
							    	if (res.data.state === "failure") {
							    		$scope.error_message = "Invalid new password";
							    	} else {
							    		
							    		/* after the password is updated, log in the user,
							    		*  clear the temp user and refresh the page to get the signed in user
							    		*/
							    		$location.path('/');
							    		window.location.reload();
							    	}
					    		},
						    	function(error){
						    		$scope.error_message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
						    	}	
					    	);
			   		},
			    	function(error){
			    		$scope.error_message = 'error getting to the server : ' + error.status + ' ' + error.statusText;
			    	}				   		
			   	);
	   };
	   
}]);
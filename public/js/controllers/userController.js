angular.module('UserModule', ['UsersService'])
	.controller('UserController',['$scope','$http','$location','UsersSvc','$routeParams', 
	function($scope, $http, $location, UsersSvc, $routeParams){
		// will hold an error message to give feeback to the user
		$scope.error_message = '';
		// will hold user information to be send to the server for authentication.
	    $scope.user = {username: '', password: '', email: ''};
	    
	    $scope.isGettingNewPassword = function() {
	    	if ($location.url() == '/newPassword'){
	    		return true;
	    	} else {
	    		return false;
	    	}
	    };
	    
	    
	 	// signout for all users (social or local)
	    $scope.signout = function(){
	        	UsersSvc.signout().then(function(){
		        	UsersSvc.user = null;
	        		$scope.getCurrentUser();
	        		$location.path('/');	
	        	});

	     };
	     
	    // gets current user, either temp or signed in
	    $scope.getCurrentUser = function() {
	    	return UsersSvc.user ? UsersSvc.user : null;
	    }; 
	    
	   /* implementing the login and signup features on angular 
	   *  in order to have more control 
       *  on what to display to the user if anything goes wrong 
	   */
	   $scope.login = function() {
	   	UsersSvc.login($scope.user).success(function(data){
	    	if (data.state === "failure") {
	    		$scope.error_message = "Invalid username or password";

	    	} else {
	    		// after a succesful login send user to home page,
	    		// and refresh the page with the new user	
	    		$location.path('/');
	    		window.location.reload();
	    	}
	    });
	   };
	   
	   $scope.signup = function() {
	   	UsersSvc.signup($scope.user).success(function(data){
	    	if (data.state === "failure") {
	    		$scope.error_message = "User or email already exist";
	    	} else {
	    		// after a succesful signup send user to home page,
	    		// and refresh the page with the new user
	    		$location.path('/');
	    		window.location.reload();
	    	}
	    });
	   };
	   
	   $scope.forgotCredentials = function() {
		   	UsersSvc.forgotCredentials($scope.user).success(function(data) {
				if (data.state === 'failure') {
					$scope.error_message = 'User not Found with email ' + $scope.user.email;
				} else {
					// after user is found by email, ask the user to created a new password
					// set user name to temp user
			   		UsersSvc.user = data.user;
			   		$location.path('/newPassword');
				}

		   	});
	   	
	   };
	   
	   $scope.newPassword = function() {
	   		// assign temp username to user object in order to be used as a query to update password
	   		$scope.user.username = UsersSvc.user.username;
		   	
		   	UsersSvc.newPassword($scope.user).success(function() {
			   	$http.post('/auth/login', $scope.user).success(function(data){
			    	if (data.state === "failure") {
			    		$scope.error_message = "Invalid new password";
			    	} else {
			    		
			    		/* after the password is updated, log in the user,
			    		*  clear the temp user and refresh the page to get the signed in user
			    		*/
			    		$location.path('/');
			    		window.location.reload();
			    	}
			    });
		   	});
	   	
	   };
	   
}]).controller('UserPollsController',['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
    	var url = '/poll/userPolls/' + $routeParams.id;
		$scope.profilePolls = [];
		
		$http.get(url).success(function(data){
	    		if (data.state === "success") {
	    			$scope.profilePolls = data.polls;
	    		} else {
	    			console.log("error getting user poll");
	    		}	
	    });
	    
	    $scope.delete = function(title, index) {
	    	var url =  '/poll/delete/' + title;
	    	$http.delete(url).then(function(data){
	    		if (!data.state === 'success') {
	    			$scope.errorMessageDeletingPoll = data.message;
	    		} else {
	    			$scope.profilePolls.splice(index, 1);
	    		}
	    	});
	    };
    
}]);
angular.module('UserModule', ['UsersState'])
	.controller('UserController',['$scope','$http','$location','Authentication','$routeParams', '$rootScope', 
	function($scope, $http, $location, Authentication, $rootScope, $routeParams){
		// will hold an error message to give feeback to the user
		$scope.error_message = '';
		// will hold user information to be send to the server for authentication.
	    $scope.user = {username: '', password: '', email: ''};
	    
	 	// signout for all users (social or local)
	    $scope.signout = function(){
	        $http.get('/auth/signout');
	        Authentication.user = null;
	        $rootScope.temp_user = '';
	        $scope.getCurrentUser();
	        $location.path('/');
	     }
	    // gets current user, either temp or signed in
	    $scope.getCurrentUser = function() {
	    	return getTempUser() || getSignedUser();
	    } 
	    
	   /* implementing the login and signup features on angular 
	   *  in order to have more control 
       *  on what to display to the user if anything goes wrong 
	   */
	   $scope.login = function() {
	   	$http.post('/auth/login', $scope.user).success(function(data){
	    	if (data.state === "failure") {
	    		$scope.error_message = "Invalid username or password";

	    	} else {
	    		// after a succesful login send user to home page,
	    		// and refresh the page with the new user	
	    		$location.path('/');
	    		window.location.reload();
	    	}
	    });
	   }
	   
	   $scope.signup = function() {
	   	$http.post('/auth/signup', $scope.user).success(function(data){
	    	if (data.state === "failure") {
	    		$scope.error_message = "User or email already exist";
	    	} else {
	    		// after a succesful signup send user to home page,
	    		// and refresh the page with the new user
	    		$location.path('/');
	    		window.location.reload();
	    	}
	    });
	   }
	   
	   $scope.forgotCredentials = function() {
		   	$http.post('/auth/forgotCredentials', $scope.user).success(function(data) {
				
				if (data.state === 'failure') {
					$scope.error_message = 'User not Found with email ' + $scope.user.email;
				} else {
					// after user is found by email, ask the user to created a new password
					// set user name to temp user
			   		$rootScope.temp_user = data.user;
			   		$location.path('/newPassword')
				}

		   	})
	   	
	   }
	   
	   $scope.newPassword = function() {
	   		// assign temp username to user object in order to be used as a query to update password
	   		$scope.user.username = $rootScope.temp_user.username;
		   	$http({
		   		method: 'PUT',
	    		url: '/auth/newPassword',
	    		data: $scope.user,
	    		headers: {'Content-Type': 'application/json'}
		   	}).success(function() {
			   	$http.post('/auth/login', $scope.user).success(function(data){
			    	if (data.state === "failure") {
			    		$scope.error_message = "Invalid new password";
			    	} else {
			    		
			    		/* after the password is updated, log in the user,
			    		*  clear the temp user and refresh the page to get the signed in user
			    		*/
			    		$rootScope.temp_user = '';
			    		$location.path('/');
			    		window.location.reload();
			    	}
			    });
		   	})
	   	
	   }
	   
		// gets current temp user 
	    var getTempUser = function() {
	    	return $rootScope.temp_user;
	    }
	    
	    // gets signed in user 
	    var getSignedUser = function() {
	        return Authentication.user ? Authentication.user : null;
	    }	   
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
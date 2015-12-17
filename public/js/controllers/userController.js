angular.module('UserModule', ['UsersState'])
	.controller('UserController',['$scope','$http','$location','Authentication','$timeout','$rootScope', 
	function($scope, $http, $location, Authentication, $rootScope){
		// will hold an error message to give feeback to the user
		$scope.error_message = '';
		// will hold user information to be send to the server for authentication.
	    $scope.user = {username: '', password: '', email: ''};
	 	
	 	// signout for all users (social or local)
	    $scope.signout = function(){
	        $http.get('/auth/signout');
	        Authentication.user = null;
	        $rootScope.current_user = '';
	        $scope.getCurrentUser();
	        $location.path('/');
	     }
	    
	    $scope.getCurrentUser = function() {
	    	return getLocalUser() || getSocialUser();
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
	    		// and assign it as current user.	
	    		$rootScope.current_user = data.user;
	    		$location.path('/');	
	    	}
	    });
	   }
	   
	   $scope.signup = function() {
	   	$http.post('/auth/signup', $scope.user).success(function(data){
	    	if (data.state === "failure") {
	    		
	    		$scope.error_message = "User already exist";
	    		
	    	} else {
	    		// after a succesful signup send user to home page,
	    		// and assign it as current user.
	    		$rootScope.current_user = data.user;
	    		$location.path('/');	
	    	}
	    });
	   }
	   
	   $scope.forgotCredentials = function() {
	   	
		   	$http({
		   		method: 'POST',
	    		url: '/auth/forgotCredentials',
	    		data: $scope.user,
	    		headers: {'Content-Type': 'application/json'}
		   	}).success(function(data) {
				
				// after user is found by email, ask the user to created a new password
				// set user name to current user
		   		$rootScope.current_user = data.user;
		   		$location.path('/newPassword')
		   	})
	   	
	   }
	   
	   $scope.newPassword = function() {
	   		// assign current user to user object in order to be used as a query to update password
	   		$scope.user.username = $rootScope.current_user.username;
	   		
		   	$http({
		   		method: 'POST',
	    		url: '/auth/newPassword',
	    		data: $scope.user,
	    		headers: {'Content-Type': 'application/json'}
		   	}).success(function(data) {
		   		
		   		// after new password is created send user to home page
		   		// and keep user as current user
		   		$rootScope.current_user = data.user;
		   		$location.path('/')
		   	})
	   	
	   }	   
	   
		// gets current local user 
	    var getLocalUser = function() {
	    	return $rootScope.current_user;
	    }
	    
	    // gets current social media signed in user 
	    var getSocialUser = function() {
	        return Authentication.user ? Authentication.user : null;
	    }	   
	   
}]);
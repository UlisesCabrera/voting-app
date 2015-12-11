angular.module('AuthModule', ['UsersState'])
	.controller('AuthController',['$scope','$http','$location','Authentication','$timeout','$rootScope', 
	function($scope, $http, $location, Authentication, $rootScope){
		// will hold an error message to give feeback to the user
		$scope.error_message = '';
		
		// will hold user information to be send to the server for authentication.
	    $scope.user = {username: '', password: ''};
	 	
	 	// signout for all users (social or local)
	    $scope.signout = function(){
	        $http.get('/auth/signout');
	        Authentication.user = null;
	        $rootScope.current_user = '';
	        $scope.getSocialUser();
	     }
	     
		// gets current local user 
	    $scope.getLocalUser = function() {
	    	return $rootScope.current_user;
	    }
	    
	    // gets current social media signed in user 
	    $scope.getSocialUser = function() {
	        return Authentication.user ? Authentication.user.username : null;
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
	    		
	    		$rootScope.current_user = data.user.username;
	    		$location.path('/');	
	    	}
	    });
	   }
	   
	   $scope.signup = function() {
	   	$http.post('/auth/signup', $scope.user).success(function(data){
	    	if (data.state === "failure") {
	    		
	    		$scope.error_message = "User already exist";
	    		
	    	} else {
	    		$rootScope.current_user = data.user.username;
	    		$location.path('/');	
	    	}
	    });
	    
	   }
	   
}]);
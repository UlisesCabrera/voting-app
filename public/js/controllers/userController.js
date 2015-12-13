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
	    		$rootScope.current_user = data.user;
	    		$location.path('/');	
	    	}
	    });
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
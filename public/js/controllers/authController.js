angular.module('AuthModule', ['UsersState'])
	.controller('AuthController',['$scope','$http','$location','Authentication','$timeout', 
	function($scope, $http, $location, Authentication){
		$scope.error_message = '';
	    
	    $scope.signout = function(){
	        $http.get('/auth/signout');
	        Authentication.user = null;
	        $scope.currentUser();
	    }
	    
	    $scope.currentUser = function() {
	        return Authentication.user ? Authentication.user.username : null;
	    }
}]);
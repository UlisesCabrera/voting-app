angular.module('TimelineModule', ['UsersState'])
    .controller('TimelineController',['$scope','$http','Authentication','$rootScope', function($scope, $http, Authentication, $rootScope) {
            
    $scope.errorPollMessage = '';
    
    $scope.poll = {title:'', choiceName: ''};
            
    
    $scope.newPoll = function() {
      $http.post('/poll/newpoll', $scope.poll).success(function(data){
         if (data.state === "success") {
	   		    console.log(data.poll);
	   		    
	   		    // updates current user with new poll data
	   		    if ($rootScope.current_user) {
	   		        console.log(data.user);
	   		       $rootScope.current_user = null;
	   		        Authentication.user = data.user;
	   		    } else {
	   		        Authentication.user = data.user;
	   		    }
	   		    
	   		    // resets poll object, new poll form and errors
	   		    $scope.errorPollMessage = '';
	   		    $scope.newPollForm.$setPristine();
	   		    $scope.poll = {title:'', choiceName: ''};
	   		    
	   		} else {
	   		    $scope.errorPollMessage = data.message;
	   		} 
      });
    }
    
    //$http.get('/poll/currentpolls').success(function(data){
             
    //});



	// gets current local user 
    var getLocalUser = function() {
    	return $rootScope.current_user;
    }
    
    // gets current social media signed in user 
    var getSocialUser = function() {
        return Authentication.user ? Authentication.user : null;
    }
    
}]);
angular.module('TimelineModule', ['UsersState'])
    .controller('TimelineController',['$scope','$http','Authentication','$rootScope', function($scope, $http, Authentication, $rootScope) {
            
    $scope.errorPollMessage = '';
    
    $scope.poll = {title:'', choiceName: ''};
            
    $scope.newPoll = function() {
      $http.post('/poll/newpoll', $scope.poll).success(function(data){
         if (data.state === "success") {
	   		    // updates current user with new poll data
	   		    if ($rootScope.temp_user) {
	   		       $rootScope.temp_user = '';
	   		        Authentication.user = data.user;
	   		    } else {
	   		        Authentication.user = data.user;
	   		    }
	   		    
	   		    // resets poll object, new poll form and errors
	   		    $scope.errorPollMessage = '';
	   		    $scope.newPollForm.$setPristine();
	   		    $scope.poll = {title:'', choiceName: ''};
	   		    
	   		} else {
	   			// error, grab the error message from the response and display it on the form.
	   		    $scope.errorPollMessage = data.message;
	   		} 
      });
    }
}]);
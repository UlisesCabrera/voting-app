angular.module('TimelineModule', ['UsersState'])
    .controller('TimelineController',['$scope','$http','Authentication','$rootScope', function($scope, $http, Authentication, $rootScope) {
            
    $scope.errorPollMessage = '';
    $scope.successPollMessage = '';
    
    $scope.poll = {title:'', choiceName: ''};
  
    $scope.newPoll = function() {
      $http.post('/poll/newpoll', $scope.poll).success(function(data){
         if (data.state === "success") {
	   		    // updates current user with new poll data
	   		    Authentication.user = data.user;
				$scope.successPollMessage = 'New poll added';
				console.log(data.newPoll);
				// pushes new poll to the current array of polls
				$scope.polls.push(data.poll);
	   		    
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

    $http.get('/poll/').success(function(data){
    	if (data.state === 'success') {
    		$scope.polls = data.polls;
    	} else {
    		$scope.displayingPollsError = data.message;
    	}
    })        

}]);
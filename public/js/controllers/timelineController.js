angular.module('TimelineModule', ['UsersService'])
    .controller('TimelineController',['$scope','$http','UsersSvc','$routeParams', function($scope, $http, UsersSvc, $routeParams) {
            
    $scope.errorPollMessage = '';
    $scope.successPollMessage = '';
    
    $scope.poll = {title:'', choiceName: ''};
  
    $scope.newPoll = function() {
      $http.post('/poll/newpoll', $scope.poll).success(function(data){
         if (data.state === "success") {
	   		    // updates current user with new poll data
	   		    UsersSvc.user = data.user;
				$scope.successPollMessage = 'New poll added';
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
    };

    $http.get('/poll/').success(function(data){
    	if (data.state === 'success') {
    		$scope.polls = data.polls;
    	} else {
    		$scope.displayingPollsError = data.message;
    	}
    });
    
    $scope.delete = function(title, index) {
    	var url =  '/poll/delete/' + title;

    	$http.delete(url).then(function(data){
    		if (!data.state === 'success') {
    			$scope.errorMessageDeletingPoll = data.message;
    		} else {
    			$scope.polls.splice(index, 1);
    		}
    	});
    };
    
}]);
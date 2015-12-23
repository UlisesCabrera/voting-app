angular.module('TimelineModule', ['UsersService','PollsService'])
    .controller('TimelineController',['$scope','$http','UsersSvc','$routeParams','PollsSvc', function($scope, $http, UsersSvc, $routeParams, PollsSvc) {
            
    $scope.errorPollMessage = '';
    $scope.successPollMessage = '';
    $scope.displayingPollsError = '';
    
    $scope.poll = {title:'', choiceName: ''};
  
    $scope.newPoll = function() {
      PollsSvc.newPoll($scope.poll)
        .then(
            function(res){
                 if (res.data.state === "success") {
        	   		    // updates current user with new poll data
        	   		    UsersSvc.user = res.data.user;
        				$scope.successPollMessage = 'New poll added';
        				// pushes new poll to the current array of polls
        				$scope.polls.push(res.data.poll);
        	   		    
        	   		    // resets poll object, new poll form and errors
        	   		    $scope.errorPollMessage = '';
        	   		    $scope.newPollForm.$setPristine();
        	   		    $scope.poll = {title:'', choiceName: ''};
        	   		    
    	   		} else {
    	   			// error, grab the error message from the response and display it on the form.
    	   		    $scope.errorPollMessage = res.data.message;
    	   		} 
            },
            function(error) {
	        	$scope.errorPollMessage = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        } 
        );
    };

    PollsSvc.getAllPolls()
        .then(
            function(res){
            	if (res.data.state === 'success') {
            		$scope.polls = res.data.polls;
            	} else {
            		$scope.displayingPollsError = res.data.message;
            	}
            },
            function(error) {
	        	$scope.errorMessageDeletingPoll = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        }              
        );
        
    $scope.delete = function(title, index) {
    	PollsSvc.deletePoll(title)
    	    .then(
    	        function(res){
            		if (res.data.state === 'failure') {
            			$scope.errorMessageDeletingPoll = res.data.message;
            		} else {
            			$scope.polls.splice(index, 1);
            		}
    	        },
	        	function(error) {
	        		$scope.errorMessageDeletingPoll = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        	}    	        
    	    );
    };
    
}]);
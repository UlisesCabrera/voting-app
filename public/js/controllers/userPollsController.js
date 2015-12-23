angular.module('UserPollsModule', ['PollsService'])
.controller('UserPollsController',['$scope', '$routeParams', '$http','PollsSvc', function($scope, $routeParams, $http, PollsSvc){
    	// will hold any error message from all the server side comunication
    	$scope.errorMessageProfilePoll = '';
    	
		// will hold all the user created polls
		$scope.profilePolls = [];
		// gets current user polls by providing user id
		PollsSvc.getUserPolls($routeParams.id)
		    .then(
    		    function(res){
    		        // fills array with user polls
    	    		if (res.data.state === "success") {
    	    			$scope.profilePolls = res.data.polls;
    	    		} else {
    	    			console.log("error getting user poll");
    	    		}	
	            },
	        	function(error) {
	        		$scope.errorMessageProfilePoll = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        	}
	        );
	    // deletes clicked poll
	    $scope.delete = function(title, index) {
            PollsSvc.deletePoll(title)
	    	    .then(
	    	        function(res){
        	    		if (res.data.state === 'success') {
        	    			$scope.profilePolls.splice(index, 1);
        	    		} else {
        	    			$scope.errorMessageProfilePoll = res.data.message;
        	    		}
	    	        },
    	        	function(error) {
    	        		$scope.errorMessageProfilePoll = 'error getting to the server : ' + error.status + ' ' + error.statusText;
    	        	}	    	        
	    	    );
	    };
}]);
angular.module('UserPollsModule', ['PollsService'])
.controller('UserPollsController',['$scope', '$routeParams','PollsSvc', function($scope, $routeParams, PollsSvc){
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
	    $scope.delete = function(id, index) {
            PollsSvc.deletePoll(id)
	    	    .then(
	    	        function(res){
        	    		if (res.data.state === 'success') {
        	    			// refresh the profile with the aviable polls
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
angular.module('UserPollsModule', [])
.controller('UserPollsController',['$scope', '$routeParams', '$http', function($scope, $routeParams, $http){
    	$scope.errorMessageProfilePoll = '';
    	
    	var url = '/poll/userPolls/' + $routeParams.id;
		$scope.profilePolls = [];
		
		$http.get(url)
		    .then(
    		    function(res){
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
	    
	    $scope.delete = function(title, index) {
	    	var url =  '/poll/delete/' + title;
	    	$http.delete(url)
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
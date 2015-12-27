angular.module('TimelineModule', ['UsersService','PollsService'])
    .controller('TimelineController',['$scope','UsersSvc','$routeParams','PollsSvc', function($scope, UsersSvc, $routeParams, PollsSvc) {
            
    $scope.errorPollMessage = '';
    $scope.successPollMessage = '';
    $scope.displayingPollsError = '';
    
    $scope.poll = {title:'', choiceNames: []};
    
    //http://stackoverflow.com/questions/16824853/way-to-ng-repeat-defined-number-of-times-instead-of-repeating-over-array
    // copy code from the above stackflow question on how to use ng-repeat a define number of times
    
    // 2 options by default
    $scope.choices = 2;
    
    // returns array with the lenght defined by options qty
    $scope.getChoice = function(num) {
        return new Array(num);   
    };
    
    // add new option function
    $scope.addChoice = function() {
        $scope.choices+=1;
    };
    
    // delete option function
    $scope.deleteChoice = function(){
        $scope.choices-=1;
    };
  
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
        	   		    $scope.poll = {title:'', choiceNames: []};
        	   		    // hides modal after the poll is created
        	   		    $('#newPollModal').modal('hide');
        	   		    
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
        
    $scope.delete = function(id, index) {
    	PollsSvc.deletePoll(id)
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
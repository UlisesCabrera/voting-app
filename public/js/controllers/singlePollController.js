angular.module('SinglePollModule', ['UsersService', 'PollsService'])
    .controller('SinglePollController',['$scope','UsersSvc','$routeParams','PollsSvc', function($scope, UsersSvc, $routeParams, PollsSvc) {
    // will display error message here        
    $scope.errorPollMessage = '';
    // will hold title params to use on the url
    var id = $routeParams.id;
  
 
    // gets clicked poll from the server
    PollsSvc.getSinglePoll(id)
        .then(
            function(res){
            	if (res.data.state === 'success') {
            		$scope.poll = res.data.poll;
            		$scope.hello= "hello from single poll and here is the title " + $scope.poll.title;
            	} else {
            		$scope.errorPollMessage = res.data.message;
            	}
            },
            function(error) {
	        	$scope.errorPollMessage = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        }    
        );
    // updates clicked choice, sends poll id and choice id so it can be found on the server    
    $scope.vote = function(pollId, choiceId) {
        PollsSvc.vote(pollId, choiceId)
            .then(
                function(res){
                    if(res.data.state === 'success') {
                        console.log('Vote successfully');
                        // render the updated poll from the sucessful vote action
                        $scope.poll = res.data.poll;
                    } else {
                        $scope.errorPollMessage = res.data.message;
                    }
                },
                function(error) {
    	        	$scope.errorPollMessage = 'error getting to the server : ' + error.status + ' ' + error.statusText;
    	        }    
        );
    };    
}]);
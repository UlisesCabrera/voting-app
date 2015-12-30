/*global randomColor, angular, twttr */

angular.module('SinglePollModule', ['UsersService', 'PollsService', 'chart.js'])
    .controller('SinglePollController',['$scope','UsersSvc','$routeParams','PollsSvc','$location', function($scope, UsersSvc, $routeParams, PollsSvc, $location) {
    // will display error message here        
    $scope.errorPollMessage = '';
    
    // will hold labels and votes counts of the data coming from the server
    $scope.labels = [];
    $scope.data = [];
    
    // returns 40 random colors to use on the chart
    $scope.colors = randomColor({ count: 40, luminosity: 'dark'});
    
    // function to push data to chart
    var pushDataToChart = function(choices){
        choices.forEach(function(choice){
            $scope.labels.push(choice.choiceName);
            $scope.data.push(choice.votes);
        });
    };
    
    // function to clear the chart before updating it with the new vote
    var resetChart = function(){
        $scope.labels =[];
        $scope.data = [];
    };
        
        
    
    // will hold title params to use on the url
    var id = $routeParams.id; 
    // gets clicked poll from the server
    PollsSvc.getSinglePoll(id)
        .then(
            function(res){
            	if (res.data.state === 'success') {
            	    pushDataToChart(res.data.poll.choices);
            		$scope.poll = res.data.poll;
            		// building tweet to use if sharing via twitter.
                    $scope.tweetText = 'Check out this poll: ' + $scope.poll.title + ' made by: ' + $scope.poll.created_by;
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
                        resetChart();
                        pushDataToChart(res.data.poll.choices);
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
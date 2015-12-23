angular.module('SinglePollModule', ['UsersService', 'PollsService'])
    .controller('SinglePollController',['$scope','$http','UsersSvc','$routeParams','PollsSvc', function($scope, $http, UsersSvc, $routeParams, PollsSvc) {
    // will display error message here        
    $scope.errorPollMessage = '';
    // will hold title params to use on the url
    var title = $routeParams.title;
    
    //test
    $scope.hello= "hello from single poll and here is the title " + title;
    
    // gets clicked poll from the server
    PollsSvc.getSinglePoll(title)
        .then(
            function(res){
            	if (res.data.state === 'success') {
            		$scope.poll = res.data.poll;
            	} else {
            		$scope.errorPollMessage = res.data.message;
            	}
            },
            function(error) {
	        	$scope.errorPollMessage = 'error getting to the server : ' + error.status + ' ' + error.statusText;
	        }    
        );
}]);
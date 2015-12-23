angular.module('SinglePollModule', ['UsersService'])
    .controller('SinglePollController',['$scope','$http','UsersSvc','$routeParams', function($scope, $http, UsersSvc, $routeParams) {
            
    $scope.errorPollMessage = '';
    $scope.successPollMessage = '';
    
    $scope.hello= "hello from single poll and here is the title " + $routeParams.title;
    
    var url = '/poll/' + $routeParams.title;
    
    $http.get(url).success(function(data){
    	if (data.state === 'success') {
    		$scope.poll = data.poll;
    	} else {
    		$scope.displayingPollsError = data.message;
    	}
    })
    
}]);
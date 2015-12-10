angular.module('MainModule', ['UsersState'])
    .controller('MainController',['$scope','Authentication', '$http', 
        function($scope, Authentication, $http){
    
        $scope.signout = function(){
            $http.get('/auth/signout');
            Authentication.user = null;
            $scope.user();
        }
        
        $scope.user = function() {
            return Authentication.user ? Authentication.user.username : null;
        }
        
        $scope.consoleUser = function(){
            console.log($scope.user());
        }
}]);
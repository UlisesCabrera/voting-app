angular.module('Voting-Poll', ['ngRoute', 'UserModule', 'TimelineModule','ngMessages']).run(function($rootScope){
	$rootScope.current_user = '';
	$rootScope.getRootUser = function() {
		return $rootScope.current_user;
	}
})
.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/login', {
			templateUrl: './partials/login.html',
			controller: 'UserController',
			resolve : {
				userState : function($http, $location){
					$http.get('auth/userState').success(function(data){
						if(data.state === "success") {
							$location.path('/profile');
						}
					})
				}
			}
		})
		.when('/profile/', {
			templateUrl: './partials/profile.html',
			controller: 'UserController',
			resolve : {
				userState : function($http, $location){
					$http.get('auth/userState').success(function(data){
						if(data.state === "failure") {
							$location.path('/login');
						}
					})
				}
			}
		})		
		
		.when('/signup', {
			templateUrl: './partials/register.html',
			controller: 'UserController',
			resolve : {
				userState : function($http, $location){
					$http.get('auth/userState').success(function(data){
						if(data.state === "success") {
							$location.path('/profile');
						}
					})
				}
			}			
		})
		.when('/forgotCredentials', {
			templateUrl: './partials/forgotCredentials.html',
			controller: 'UserController'
		})
		
		.when('/newPassword', {
			templateUrl: './partials/newPassword.html',
			controller: 'UserController'
		})
		.otherwise({
		 	redirectTo: "/"
		});
});

angular.element(document).ready(function() {
	angular.bootstrap(document, ['Voting-Poll']);
});

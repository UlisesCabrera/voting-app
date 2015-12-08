angular.module('Voting-Poll', ['ngRoute', 'ngResource', 'AuthModule', 'MainModule']).run(function($http, $rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = 'Guest';

	$rootScope.signout = function(){
		$http.get('auth/signout');
		$rootScope.authenticated = false;
		$rootScope.current_user = 'Guest';
	};
}).config(function($routeProvider){
	$routeProvider
		//the timeline display
		.when('/', {
			templateUrl: './partials/main.html',
			controller: 'MainController'
		})
		//the login display
		.when('/login', {
			templateUrl: './partials/login.html',
			controller: 'AuthController'
		})
		//the signup display
		.when('/signup', {
			templateUrl: './partials/register.html',
			controller: 'AuthController'
		});
});
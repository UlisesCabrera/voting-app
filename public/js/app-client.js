angular.module('Voting-Poll', ['ngRoute', 'AuthModule', 'MainModule'])

.config(function($routeProvider){
	$routeProvider
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
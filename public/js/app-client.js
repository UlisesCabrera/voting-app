angular.module('Voting-Poll', ['ngRoute', 'UserModule', 'TimelineModule','ngMessages']).run(function($rootScope){
	$rootScope.current_user = '';
})
.config(function($routeProvider, $locationProvider){
	$routeProvider
		//the login display
		.when('/login', {
			templateUrl: './partials/login.html',
			controller: 'UserController'
		})
		.when('/profile/', {
			templateUrl: './partials/profile.html',
			controller: 'UserController'
		})		
		//the signup display
		.when('/signup', {
			templateUrl: './partials/register.html',
			controller: 'UserController'
		})
		.when('/forgotCredentials', {
			templateUrl: './partials/forgotCredentials.html',
			controller: 'UserController'
		})
		
		.when('/newPassword', {
			templateUrl: './partials/newPassword.html',
			controller: 'UserController'
		});
});

angular.element(document).ready(function() {
	angular.bootstrap(document, ['Voting-Poll']);
});
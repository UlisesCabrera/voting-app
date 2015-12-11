angular.module('Voting-Poll', ['ngRoute', 'AuthModule', 'TimelineModule']).run(function($rootScope){
	$rootScope.current_user = '';
})
.config(function($routeProvider, $locationProvider){
	$routeProvider
		//the login display
		.when('/', {
			controller: 'AuthController'
		})
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

angular.element(document).ready(function() {
	angular.bootstrap(document, ['Voting-Poll']);
});
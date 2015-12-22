angular.module('Voting-Poll', ['ngRoute', 'UserModule', 'TimelineModule','SinglePollModule','ngMessages']).run(function($rootScope){
	// will be used to temporarly save the username when recovering password
	$rootScope.temp_user = '';
})
.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl:'./partials/timeline.html',
			controller: 'TimelineController'
		})
		.when('/poll/:title', {
			templateUrl:'./partials/singlePoll.html',
			controller: 'SinglePollController'
		})
		.when('/login', {
			templateUrl: './partials/login.html',
			controller: 'UserController',
			resolve : {
				// checks for userstate before granting access to this route
				userState : function($http, $location){
					$http.get('auth/userState').success(function(data){
						if(data.state === "success") {
							$location.path('/profile');
						}
					})
				}
			}
		})
		.when('/profile/:id', {
			templateUrl: './partials/profile.html',
			controller: 'UserPollsController',
			resolve : {
				// checks for userstate before granting access to this route
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
				// checks for userstate before granting access to this route
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

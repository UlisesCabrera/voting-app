angular.module('Voting-Poll', ['ngRoute', 'UserModule', 'TimelineModule','SinglePollModule','ngMessages','UserPollsModule'])

.config(function($routeProvider, $locationProvider){
	$routeProvider
		.when('/', {
			templateUrl:'./partials/timeline.html',
			controller: 'TimelineController'
		})
		.when('/poll/:id', {
			templateUrl:'./partials/singlePoll.html',
			controller: 'SinglePollController'
		})
		.when('/login', {
			templateUrl: './partials/login.html',
			controller: 'UserController',
			resolve : {
				// checks for userstate before granting access to this route
				userState : function($http, $location){
					$http.get('auth/userState').then(function(res){
						if(res.data.state === "success") {
							$location.path('/profile');
						}
					});
				}
			}
		})
		.when('/profile/:id', {
			templateUrl: './partials/profile.html',
			controller: 'UserPollsController',
			resolve : {
				// checks for userstate before granting access to this route
				userState : function($http, $location){
					$http.get('auth/userState').then(function(res){
						if(res.data.state === "failure") {
							$location.path('/login');
						}
					});
				}
			}
		})		
		
		.when('/signup', {
			templateUrl: './partials/register.html',
			controller: 'UserController',
			resolve : {
				// checks for userstate before granting access to this route
				userState : function($http, $location){
					$http.get('auth/userState').then(function(res){
						if(res.data.state === "success") {
							$location.path('/profile');
						}
					});
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

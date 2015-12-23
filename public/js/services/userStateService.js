angular.module('UsersService', []).service('UsersSvc', ['$http',
    function($http) {
        // gets user passed to the window object by the server
        this.user = window.user;
        
        this.signout = function() {
            return $http.get('/auth/signout');
        };
        
	   /* implementing all the local user features on angular 
	   *  in order to have more control 
       *  on what to display to the user if anything goes wrong 
	   */        
        this.login = function(user) {
            return $http.post('/auth/login', user); 
        };
        
        this.signup = function(user) {
            return $http.post('/auth/signup', user);
        };
        
        this.forgotCredentials = function(user) {
            return $http.post('/auth/forgotCredentials', user);
        };
        
        this.newPassword = function(user) {
            return $http({
    		   		method: 'PUT',
    	    		url: '/auth/newPassword',
    	    		data: user,
    	    		headers: {'Content-Type': 'application/json'}
		   	    });            
        };
        
        
}]);
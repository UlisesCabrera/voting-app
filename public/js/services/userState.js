angular.module('UsersState', []).factory('Authentication', [
    
    function() {
        this.user = window.user;
        return {
            user: this.user
        };
    }
    
]);
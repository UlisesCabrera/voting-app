angular.module('PollsService', []).service('PollsSvc', ['$http', function($http) {
            // creates new poll
            this.newPoll = function(newPoll) {
                return $http.post('/poll/newpoll', newPoll);
            };
            
            // gets all polls
            this.getAllPolls = function() {
               return $http.get('/poll/'); 
            };
            
            // gets poll clicked from the timeline
            this.getSinglePoll = function(title) {
                var url = '/poll/' + title;
                return $http.get(url);
            };
            
            // gets current user polls to show on the profile
            this.getUserPolls = function(id) {
                var url = '/poll/userPolls/' + id;
                return $http.get(url);
            };
            
            // deletes provided poll from server
            this.deletePoll = function(title) {
                var url =  '/poll/delete/' + title;
                return $http.delete(url);
            };
        
}]);
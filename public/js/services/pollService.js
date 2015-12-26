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
            this.getSinglePoll = function(id) {
                var url = '/poll/' + id;
                return $http.get(url);
            };
            
            // gets current user polls to show on the profile
            this.getUserPolls = function(id) {
                var url = '/poll/userPolls/' + id;
                return $http.get(url);
            };
            
            // deletes provided poll from server
            this.deletePoll = function(id) {
                var url =  '/poll/delete/' + id;
                return $http.delete(url);
            };
            
            // user can vote
            this.vote = function(pollId, choiceId) {
                var url = '/poll/vote/' + pollId + '/' + choiceId;
                return $http.put(url);                  
            };
        
}]);
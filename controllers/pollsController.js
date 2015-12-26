var mongoose = require('mongoose');
var Poll = mongoose.model('Poll');
var User = mongoose.model('User');

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.send({message:"not authorized"});
};

exports.list =  function(req,res){
    // stage 1: find all polls
    Poll.find({}, function(err, polls){
       //Stage 2: check for errors
       if (err) {
           console.log('error getting all polls' + err);
           res.send({state: 'failure', message:'error getting polls from server', polls: null});
       } else {
            // Stage 3: send back polls array object
            if (polls) {
                res.send({state: 'success', message:'sucessfully got all polls', polls: polls});
            } else {
                res.send({state: 'failure', message:'did not find polls', polls: null});
            }
       }
    });
    
};

exports.read = function(req,res){
    // Stage 1: construct query
    var query = {_id: req.params.id};
    // Stage 2: perform a findone search on polls data base
    Poll.findById(query, function(err, poll){
       // Stage 3: check for errors
       if (err) {
           console.log('error getting poll' + err);
           res.send({state: 'failure', message:'error getting polls from server', poll: null});
       } else {
            // Stage 4: send back poll 
            if (poll) {
                 res.send({state: 'success', message:'sucessfully got all polls', poll: poll});
            } else {
                res.send({state: 'failure', message:'did not find poll', poll: null});
            }
       }
    });
    
};

exports.readUserPolls = function(req, res) {
    var query = { created_by_id : req.params.id };
    
    Poll.find(query, function(err, polls){
       // Stage 1: check for errors
       if (err) {
           console.log('error getting poll' + err);
           res.send({state: 'failure', message:'error getting polls from server', polls: null});
       } else {
            // Stage 2: send back polls 
            if (polls) {
                 res.send({state: 'success', message:'sucessfully got all polls', polls: polls});
            } else {
                 res.send({state: 'failure', message:'did not find any polls', polls: null});
            }
       }
    });
    
};

exports.create =  function(req, res){
    //Stage 1: find if there is a poll with the same name
    Poll.findOne({title: req.body.title}, function(err, poll){
        if (err) {
            console.log("Error finding poll" + err);
            res.send({state: 'failure', message: 'Error finding poll'});
        } else {
            if (poll) {
                //if poll exist send failure to client
                console.log("Poll already exists with title " + req.body.title);
                res.send({state: 'failure', message: "Poll already exists with title " + req.body.title});
            } else {
                
                //stage 2 : create new poll

                var newPoll = new Poll();

                newPoll.title = req.body.title;
                newPoll.created_by = req.user.username;
                // go thru each options name and push it to the sub document of choices
                req.body.choiceNames.forEach(function(choice, idx){
                    newPoll.choices.push({choiceName : choice});
                });
                
                newPoll.created_by_id = req.user.id;
                newPoll.save(function(err, poll){
                    if (err) {
                        console.log("error saving poll " + err);
                        res.send({state: 'failure', message: "error saving poll" });
                    } else {
                        console.log('sucessfully save new poll' + poll);
                        //Stage 3 :find user by its unique id and increase count of user by 1
                        var query = { _id : req.user.id };
                        User.findByIdAndUpdate(query, {
                            // increase count of user created polls by 1
                            $inc: { polls_created_count : 1 }
                            }, function(err, user){
                            // if any error log it to the console  and send failure response to the client
                            if (err) {
                                console.log(err);
                                console.log('error increasing poll counter to user:' + req.user.id);
                                res.send({state: 'failure', message: "error increasing poll counter to user: " + req.user.username});
                            } else {
                                // stage 4 : send back updated user and newpoll to the client
                                User.findById(query, function(err, user){
                                    if (err) {
                                        console.log('error finding the user' + err);
                                    } else {
                                        res.send({state:'success', poll: newPoll, user: user});   
                                    }
                                });                            
                            }
                        });                        
                    }
                    
                });
                
            }
        }
    });
};

exports.delete = function(req, res) {
    // stage 1:  create query to find poll by id on poll model
    // and get the user id in order to perform an update on the polls_created count
    var query = { _id : req.params.id};
    var userQuery = { _id : req.user.id };
    // finding poll
    Poll.findById(query, function(err, poll){
        if (err) {
            console.log("error finding poll to remove " + err );
            res.send({state: 'failure', message: "error finding poll to remove " + err});
        } else {
            // Stage 2: check if poll is found and check if the username 
            // trying to delete the poll is the creator of the poll
            if (poll){
                if (poll.created_by === req.user.username) {
                    // stage 3: decrease user poll counter
                    User.update(userQuery, {
                        // decrease count of user created polls by 1
                        $inc: { polls_created_count : -1 }
                            }, function(err, user){
                            // if any error log it to the console  and send failure response to the client
                            if (err) {
                                console.log(err);
                                console.log('error decreasing poll counter to user:' + req.user.username);
                                res.send({state: 'failure', message: "error decreasing poll counter to user: " + req.user.username});
                            } else {
                                 console.log('successfully decreased poll counter for user');
                            }
                    });                    
                    // stage 4: delete poll from polls model, send back user and poll deleted
                    poll.remove(function(err){
                        if (err) {
                            console.log('err removing poll from poll model ' + err);
                        } else {
                            console.log('successfully remove poll');
                            res.send({ state: 'success' });
                        }
                    });
                } else {
                    res.send({state:'failure', message: 'not authorized to delete this poll'});
                }
                
            } else {
                console.log('poll not found on polls schema');
                res.send({state:'failure', message: 'poll was not found'});
            }
        }
    });
};

exports.vote = function(req, res) {
    // Stage 1: find choice and increase vote and add user to the voteBy array
    Poll.findOneAndUpdate(
        { "_id": req.params.pollId, "choices._id": req.params.choiceId },
        { 
            "$push": {
                voteByUser : req.user.username
            }, 
            "$inc": {
                "choices.$.votes": 1
            }
        },
        function(err,doc) {
            if (err) {
                console.log('err voting ' + err);
                res.send({state:'failure', message: 'error voting'});
            } else {
                // stage 2: find the updated poll and send it back to client so it can be updated on the view
                var query =  { _id : doc._id };
                Poll.findById(query, function(err, poll) {
                    if (err) {
                        console.log('error finding the poll to send it back' + err);
                        res.send({state:'failure', message: 'poll was not found again'});
                    } else {
                        res.send({state:'success', poll: poll});   
                    }
                });    
            }
        }
    );
    
};
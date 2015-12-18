var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Poll = mongoose.model('Poll');
var User = mongoose.model('User');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.send({message:"not authorized"})
}

// Getting all POLLS
router.get('/', function(req,res){
    /*
    * Stage 1: find all polls
    */
    Poll.find({}, function(err, polls){
            /*
            * Stage 2: check for errors
            */
       if (err) {
           console.log('error getting all polls' + err);
           res.send({state: 'failure', message:'error getting polls from server', polls: null});
       } else {
            /*
            * Stage 3: send back polls array object
            */
           res.send({state: 'success', message:'sucessfully got all polls', polls: polls});
       }
    });
    
});

// CREATING NEW POLLS
/*
* Stage 1: check if user is authenticated
*/
router.post('/newpoll', ensureAuthenticated, function(req, res){
    /*
    * Stage 2: find if there is a poll with the same name
    */
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
                /*
                * stage 3 : create new poll
                */
                //console.log(req.body);
                var newPoll = new Poll();
                //console.log(newPoll);
                newPoll.title = req.body.title;
                newPoll.created_by = req.user.username;
                newPoll.choices = req.body.choiceName;
                newPoll.save(function(err, poll){
                    if (err) {
                        console.log("error saving poll" + err);
                    }
                    console.log('sucessfully save new poll');
                });
                /*
                * Stage 4 :find user by its unique id and add new poll to his list
                */
                var query = { _id : req.user.id };
        
                User.findByIdAndUpdate(query, {
                    // push newPoll object to array of polls
                    $push: { polls_created : newPoll },
                    // increase count of user created polls by 1
                    $inc: { polls_created_count : 1 }
                    }, function(err, user){
                    // if any error log it to the console  and send failure response to the client
                    if (err) {
                        console.log(err);
                        console.log('error adding poll to user:' + req.user.id);
                        res.send({state: 'failure', message: "error adding poll to user: " + req.user.username});
                    } else {
                        /*
                         *  stage 5 : send back updated user and newpoll to the client
                         */
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
        }
    });
});

module.exports = router;
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

router.post('/newpoll',ensureAuthenticated, function(req, res){
    
    Poll.findOne({title: req.body.title}, function(err, poll){
        if (err) {
            console.log("Error finding poll" + err);
            res.send({state: 'failure', message: 'Error finding poll'});
        } else {
            if (poll) {
                console.log("Poll already exists with title " + req.body.title);
                res.send({state: 'failure', message: "Poll already exists with title " + req.body.title});
            } else {
                //console.log(req.body);
                var newPoll = new Poll();
                //console.log(newPoll);
                newPoll.title = req.body.title;
                newPoll.created_by = req.user.username;
                newPoll.choices = req.body.choiceName;
                
                newPoll.save(function(err, poll){
                    if (err) {
                        console.log("error saving poll");
                        throw err;
                    }
                    console.log('sucessfully save new poll');
                })
            }
            
            // find user and add new poll created by user
            var query = { username : req.user.username };
            
            User.findOneAndUpdate(query, {
                // push newPoll object to array of polls
                $push: { polls_created : newPoll },
                // increase couint of user created polls by 1
                $inc: { polls_created_count : 1 }
                }, function(err, user){
                // if any error log it to the console and throw error    
                if (err) {
                    console.log('error adding poll to user:' + req.user.username);
                    throw err;
                }
            })
            
            // send back updated user and newpoll
            User.findOne(query, function(err, user){
                if (err) {
                    console.log('error finding the user')
                    throw err;
                }
                console.log(user);
                res.send({state:'success', poll: newPoll, user: user});   
            })
        }
    })
})

module.exports = router;
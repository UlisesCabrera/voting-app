var GitHubStrategy = require('passport-github').Strategy
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {

  passport.use('github', new GitHubStrategy({
      clientID: '00962de3471686393d3c',
      clientSecret: '879ce1df0eb84ffaf447fc2055319637f984b5f9',
      callbackURL: 'https://voting-app-basejump-elgris12.c9users.io/auth/github/callback'
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
      // asynchronous
      process.nextTick(function() {
        console.log(profile);
        // find the user in the database based on their facebook id
        User.findOne({
          'username': profile.displayName
        }, function(err, user) {

          // if there is an error, stop everything and return that
          // ie an error connecting to the database
          if (err)
            return done(err);

          // if the user is found, then log them in
          if (user) {
            return done(null, user); // user found, return that user
          } else {

            // if there is no user found with that facebook id, create them
            var user = new User();

            user.username = profile.displayName;
            user.password = profile.id;
            // set all of the facebook information in our user model


            // save our user to the database
            user.save(function(err) {
              if (err)
                throw err;

              // if successful, return the new user
              return done(null, user);
            });
          }
        });
      });
    }));


  var isValidPassword = function(user, password) {
    return bCrypt.compareSync(password, user.password);
  };
  // Generates hash using bCrypt
  var createHash = function(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
  };

};
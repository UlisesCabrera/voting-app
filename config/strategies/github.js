var GitHubStrategy = require('passport-github').Strategy
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(passport) {

  passport.use('github', new GitHubStrategy({
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.BASEURL + 'auth/github/callback'
    },

    // facebook will send back the tokens and profile
    function(access_token, refresh_token, profile, done) {
      // asynchronous
      process.nextTick(function() {
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

            // if there is no user found with that github id, create them
            var newUser = new User();

            newUser.username = profile.displayName;
            newUser.password = profile.id;
            newUser.email = null;
            // set all of the github information in our user model

            // save our user to the database
            newUser.save(function(err, newUser) {
              if (err) {
                console.log("problem saving user :" + err);
                return done(null, false);
              } else {
                // if successful, return the new user
                return done(null, newUser);
              }
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
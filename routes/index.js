var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  
if (req.user) {
    // if user name has a last name
    if(req.user.username.split(' ').length > 1) {
     //format the username with first letter capitalized
     var usernameStyled =  function() {
        var tempUserArray =  req.user.username.split(' ');
        var firstName = tempUserArray[0];
        var lastName =  tempUserArray[1];
        firstName = firstName[0].toUpperCase() + firstName.slice(1, firstName.length).toLowerCase();
        lastName = lastName[0].toUpperCase() + lastName.slice(1, lastName.length).toLowerCase();
        var result = firstName + ' ' + lastName;
        return result;
      }
       req.user.username = usernameStyled();
    }
  

}

  res.render('index', { 
      title: 'Voting App',
      user: JSON.stringify(req.user)
  });
});

module.exports = router;


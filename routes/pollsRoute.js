var express = require('express');
var router = express.Router();
var pollCtrl = require("../controllers/pollsController");

// List all polls
router.get('/', pollCtrl.list);

// read polls of current user
router.get('/userPolls/:id', pollCtrl.readUserPolls);

// Read single poll
router.get('/:id', pollCtrl.read);
// Creates new poll
router.post('/newpoll', pollCtrl.isAuthenticated, pollCtrl.create);
// deletes poll
router.delete('/delete/:id', pollCtrl.isAuthenticated, pollCtrl.delete);

router.put('/vote/:pollId/:choiceId', pollCtrl.isAuthenticated, pollCtrl.vote);

module.exports = router;
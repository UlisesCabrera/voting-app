var express = require('express');
var router = express.Router();
var pollCtrl = require("../controllers/pollsController");


// List all polls
router.get('/', pollCtrl.list);
// Read single pol
router.get('/:title', pollCtrl.read);
// Creates new poll
router.post('/newpoll', pollCtrl.isAuthenticated, pollCtrl.create);

module.exports = router;
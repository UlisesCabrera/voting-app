var express = require('express');
var router = express.Router();
var indexCtrl = require("../controllers/indexController");

/* GET home page. */
router.get('/', indexCtrl.sendFormatedUser);

module.exports = router;
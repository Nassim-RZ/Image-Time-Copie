var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('https://image-time.onrender.com/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;

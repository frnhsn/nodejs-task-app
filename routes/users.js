const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', function(req, res) {
  
  res.send('Login page');
});

module.exports = router;

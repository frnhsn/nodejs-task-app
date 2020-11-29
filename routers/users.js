const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js');

// const auth = async (req, res, next) => {
//     console.log('Auth middleware');
//     next();
// };

router.route('/')
  .get(function (req, res) {
    res.send('Get a random book')
  })
  .post(function (req, res) {
    res.send('Add a book')
  })
  .put(function (req, res) {
    res.send('Update the book')
  })


router.post('/login/e', (req, res) => {
    console.log(req.query);
    res.send('Login page');
    
})

router.post('/logout/', auth, async (req, res) => {
    res.send('Logout page');
})
  
module.exports = router;
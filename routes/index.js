var express = require('express');
var router = express.Router();
const {login, signUp, logout} = require('../app/Controller/UsersController');
// const {isLoggedIn} = require('../app/Middleware/auth');

/* GET home page. */

// router.use(isLoggedIn);

router.get('/', function(req, res, next) {
  res.render('login/index', { title: 'Express' });
});
router.get('/signup', function(req, res, next) {
  res.render('login/signup', { title: 'Express' });
});
router.post('/login', login);

router.post('/signup', signUp);
router.get('/logout', logout);

module.exports = router;

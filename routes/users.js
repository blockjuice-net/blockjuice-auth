var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

router.post('/login', (req, res, next) => {

  var email = req.body.email;
  var password = req.body.password;

  req.app.locals.firebase.login(email, password, true, error => {
    log('info', 'API LOGIN OK.');
    res.render('dashboard', { 
      title: '_clementineOS' 
    });     
  });

});

router.get('/logout', (req, res, next) => {

  req.app.locals.firebase.logout(error => {
    res.redirect('/');
  });

});

module.exports = router;

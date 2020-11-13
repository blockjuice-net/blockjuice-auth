var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

router.post('/login/:new', (req, res, next) => {

  var email = req.body.email;
  var password = req.body.password;

  var newUser = req.params.new == 'new'

  req.app.locals.firebase.login(email, password, newUser, (error, user) => {

    if (error != null) {
      log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
    } else {
      log('success','User: ' + JSON.stringify(user));
      res.render('dashboard', { 
        title: '_clementineOS',
        user: user
      });
    }
         
  });

});

router.get('/logout', (req, res, next) => {

  req.app.locals.firebase.logout(error => {
    res.redirect('/');
  });

});

module.exports = router;

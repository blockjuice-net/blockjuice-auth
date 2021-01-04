var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

router.get('/', (req, res, next) => {
  res.redirect('/signin')
});

router.get('/signin', (req, res, next) => {

  res.render('signin', { 
    title: process.env.TITLE,
    typeform: 'Sign In',
    error: '',
    message: '',
    client : getClientID()
  });

});

router.get('/signup', (req, res, next) => {

  res.render('signup', { 
    title: process.env.TITLE,
    typeform: 'Sign Up',
    error: '',
    message: '',
    client : getClientID()
  });

});

router.get('/forgotpassword', (req, res, next) => {
 
  res.render('forgotpassword', { 
    title: process.env.TITLE,
    typeform: 'Reset Password',
    error: '',
    message: '',
    client : getClientID()
  });
  
});

router.get('/logout', (req, res, next) => {

  req.app.locals.firebase.auth().signOut().then(() => {
    // Sign-out successful.
    res.redirect('/signin');
  }).catch(error => {
    // An error happened.
    log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);

  });

});

let getClientID = () => {
  
  var clientid = {
      google: process.env.GOOGLE_CONSUMER_KEY
  }

  log('info', JSON.stringify(clientid))

  return clientid;
}


module.exports = router;

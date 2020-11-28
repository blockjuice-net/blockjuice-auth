var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

var nJwt = require('njwt');
var secureRandom = require('secure-random');

var dotenv  = require('dotenv');
dotenv.config();

router.get('/signin', (req, res, next) => {

  res.render('signin', { 
    title: process.env.TITLE,
    typeform: 'Sign In',
    error: '',
    message: ''
  });

});

router.get('/signup', (req, res, next) => {

  res.render('signup', { 
    title: process.env.TITLE,
    typeform: 'Sign Up',
    error: '',
    message: ''
  });

});

router.get('/profile/:uid', (req, res, next) => {

  var uid = req.params.uid 

  res.render('profile', { 
    title: process.env.TITLE,
    uid: uid
  });

});

router.get('/forgotpassword', (req, res, next) => {
 
  res.render('forgotpassword', { 
    title: process.env.TITLE,
    typeform: 'Reset Password',
    error: '',
    message: ''
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

router.post('/token', (req, res, next) => {

  var payload = req.body.payload;
  var token = getToken(payload);
  log('info', 'Token: ' + JSON.stringify(payload))
  res.json(token);
  
});

// ---------------------------------------------------------------------------
// Create Key Store for Token

// create token
let getToken = (data) => {
  var signingKey = secureRandom(256, {type: 'Buffer'});
  var jwt = nJwt.create(data, signingKey);

  return {
    token: jwt,
    auth: jwt.compact()   
  };

};


module.exports = router;

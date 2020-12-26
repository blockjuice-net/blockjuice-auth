var express = require('express');
var router  = express.Router();
const log   = require('logbootstrap');

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


module.exports = router;

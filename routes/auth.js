var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');
const errors  = require('../errors');

var dotenv  = require('dotenv');
dotenv.config();

var google, github;

const FIREBASE_EMAIL_VERIFY = 'http://localhost:' + process.env.PORT + '/auth/check';
const FIREBASE_RESET_PWD = 'http://localhost:' + process.env.PORT + '/signin';

var auth;

router.use(function (req, res, next) {
  
  auth = req.app.locals.firebase.auth();

  google = new req.app.locals.firebase.auth.GoogleAuthProvider();
  github = new req.app.locals.firebase.auth.GithubAuthProvider();
  
  next();
});

/*
router.get('/provider/:provider', (req, res, next) => {

  var providerParam = req.params.provider;
  var provider;

  if (providerParam == 'google') {
    provider = google;
  } else if (providerParam == 'github') {
    provider = github;
  };

  log('info', 'LogIn with provider ' + provider);

  auth.signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    log('info', 'Provider ' + provider);
    log('info', 'User info: ' + JSON.stringify(result.user));

    res.redirect('/user/dashboard/' + result.user.uid);

    // ...
  }).catch(error => {
    // Handle Errors here.
    errors.render(res, 'signup', error);

  });

});
*/

router.post('/resetpassword', (req, res, next) => {
 
  var emailAddress = req.body.email;

  var options = {
    url: FIREBASE_RESET_PWD,
    handleCodeInApp: true
  };

  auth.sendPasswordResetEmail(emailAddress, options).then(() => {
    log('success','Reset Password OK');

    res.render('checkemail', { 
      title: process.env.TITLE,
      message: 'Please check your email and click link to reset your password ...'
    });

  }).catch(function(error) {
    // An error happened.
    errors.render(res, 'signin', error);
  });

});

// Check email link
router.get('/check', (req, res, next) => {
  
  var email = req.query.email;
  var account = req.body.account;
  var apiKey = req.query.apiKey;
  var oobCode = req.query.oobCode; 
  var mode = req.query.mode;
  var lang = req.query.lang

  var url = req.originalUrl;

  log('info', 'Parameters: ' + email + 
              '\nurl: ' + url +
              '\naccount: ' + account +
              '\napiKey' + apiKey +
              '\oobCode' + oobCode +
              '\omode' + mode + 
              '\olang' + lang);
  
  auth.signInWithEmailLink(email, url).then(result => {
    log('success', '/check OK');
    res.redirect('/user/dashboard/' + result.user.uid);
  }).catch(error => {
    errors.render(res, 'signup', error);
  });

});

// login with username and password 
router.post('/signin', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  log('info', 'LogIn by email: ' + email);

  auth.signInWithEmailAndPassword(email, password).then(result => {
    log('success', '/signin OK');
    res.redirect('/user/dashboard/' + result.user.uid);
  }).catch(error => {
    errors.render(res, 'signin', error);
  });

});

// registration new user with login and password
router.post('/signup', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  log('info', 'create user by email with ' + email);

  auth.createUserWithEmailAndPassword(email, password).then(result => {
    
    var options = {
      url: FIREBASE_EMAIL_VERIFY + '?email=' + email,
      handleCodeInApp: true
    };

    log('success', '/signup Ok.');
    log('info', 'email: ' + email);
  
    auth.sendSignInLinkToEmail(email, options).then(() => {
      log('success', '... send link to email OK');
      res.render('checkemail', { 
        title: process.env.TITLE,
        message: 'Please check your email and click link to verify your account ...'
      });

    }).catch(error => {
      errors.render(res, 'signup', error);
    });

  }).catch(error => {
    errors.render(res, 'signup', error);
  });

});

module.exports = router;

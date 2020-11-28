var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

var google, facebook, twitter, github, microsoft, apple;

const FIREBASE_EMAIL_VERIFY = 'http://localhost:' + process.env.PORT + '/auth/check';
const FIREBASE_RESET_PWD = 'http://localhost:' + process.env.PORT + '/signin';

var firebase;

router.use(function (req, res, next) {
  firebase = req.app.locals.firebase;

  google = new firebase.auth.GoogleAuthProvider();
  facebook = new firebase.auth.FacebookAuthProvider();
  twitter = new firebase.auth.TwitterAuthProvider();
  github = new firebase.auth.GithubAuthProvider();
  microsoft = new firebase.auth.OAuthProvider('microsoft.com');
  apple = new firebase.auth.OAuthProvider('apple.com');

  next();
});

router.get('/provider/:provider', (req, res, next) => {

  var providerParam = req.params.provider;
  var provider;

  if (providerParam == 'google') {
    provider = google;
  } else if (providerParam == 'facebook') {
    provider = facebook;
  } else if (providerParam == 'twitter') {
    provider = twitter;
  } else if (providerParam == 'github') {
    provider = github;
  } else if (providerParam == 'microsoft') {
    provider = microsoft;
  } else if (providerParam == 'apple') {
    provider = apple;
  }

  firebase.auth().signInWithPopup(provider).then(result => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;

    log('info', 'Provider ' + provider);
    log('info', 'User info: ' + JSON.stringify(result.user));

    res.redirect('/user/profile/' + result.user.uid);

    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    var errorMsg = errorCode + '\n' +
                   errorMessage + '\n' + 
                   email + '\n' +
                   credential;

    log('error', 'Error: ' + errorMsg);

    renderError(res, 'signup', errorMsg);

  });

});

router.post('/resetpassword', (req, res, next) => {
 
  var email = req.body.email;

  console.log('Body ' +  JSON.stringify(req.body));

  var options = {
    url: FIREBASE_RESET_PWD,
    handleCodeInApp: true
  };

  firebase.auth().sendPasswordResetEmail(email, options).then(() => {
    
    log('success','Reset Password OK');

    res.render('checkemail', { 
      title: process.env.TITLE,
      message: 'Please check your email and click link to reset your password ...'
    });

  }).catch(error => {
    renderError(res, 'signin', parseFirebaseError(error));
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
  
  firebase.auth().signInWithEmailLink(email, url).then(result => {
    log('success', '/check OK');
    res.redirect('/user/profile/' + result.user.uid);
  }).catch(error => {
    renderError(res, 'signup', parseFirebaseError(error));
  });

});

// login with username and password 
router.post('/signin', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
    log('success', '/signin OK');
    res.redirect('/user/profile/' + result.user.uid);
  }).catch(error => {
    renderError(res, 'signin', parseFirebaseError(error));
  });

});

// registration new user with login and password
router.post('/signup', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  firebase.auth().createUserWithEmailAndPassword(email, password).then(result => {
    
    var options = {
      url: FIREBASE_EMAIL_VERIFY + '?email=' + email,
      handleCodeInApp: true
    };

    log('success', '/signup OK');
  
    firebase.auth().sendSignInLinkToEmail(email, options).then(() => {
      log('success', '... send link to email OK');
      res.render('checkemail', { 
        title: process.env.TITLE,
        message: 'Please check your email and click link to verify your account ...'
      });

    }).catch(error => {
      renderError(res, 'signup', error);
    });

  }).catch(error => {
    renderError(res, 'signup', parseFirebaseError(error));
  });

});

// ----------------------------------------------------

let renderError = (res, view, error) => {

  var t;

  log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
    
  if (view == 'signup') {
    t = 'Sign Up';
  } else if (view == 'signin') {
    t = 'Sign In';
  };

  res.render(view, { 
    title: process.env.TITLE,
    typeform: t,
    error: parseFirebaseError(error),
    message: ''
  });

};

// parse error 
let parseFirebaseError = error => {
  if ((error.errorCode == 'auth/email-already-in-use') || 
      (error.errorCode == 'auth/invalid-email') || 
      (error.errorCode == 'auth/operation-not-allowed') ||
      (error.errorCode == 'auth/weak-password') || 
      (error.errorCode == 'auth/expired-action-code') || 
      (error.errorCode == 'auth/invalid-email') || 
      (error.errorCode == 'auth/user-disabled') ||
      (error.errorCode == 'auth/user-not-found') ||
      (error.errorCode == 'auth/missing-android-pkg-name') ||
      (error.errorCode == 'auth/missing-continue-uri') ||
      (error.errorCode == 'auth/missing-ios-bundle-id') ||
      (error.errorCode == 'auth/invalid-continue-uri') ||
      (error.errorCode == 'auth/unauthorized-continue-uri')) {
        return error.errorMessage;
  } else {
        return 'unidentified error or unknow user';
  }
};

module.exports = router;

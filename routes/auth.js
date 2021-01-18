var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

var dotenv  = require('dotenv');
dotenv.config();

const FIREBASE_EMAIL_VERIFY = 'http://localhost:' + process.env.PORT + '/auth/check';
const FIREBASE_RESET_PWD = 'http://localhost:' + process.env.PORT + '/signin';

var auth;

router.use(function (req, res, next) {  
  auth = req.app.locals.firebase.auth();
  next();
});

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
    sendError(res, 'signin', 'Sign In', error);
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
    sendError(res, 'signup', 'Sign Up', error);
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
    sendError(res, 'signin', 'Sign In', error);
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
      sendError(res, 'signup', 'Sign Up', error);
    });

  }).catch(error => {
    sendError(res, 'signup', 'Sign Up', error);
  });

});

router.post('/recaptcha', (req, res, next) => {

  var token = req.body.token;

  axios.post('https://www.google.com/recaptcha/api/siteverify', {
    secret: process.env.RECAPTCHA_KEY,  // The shared key between your site and reCAPTCHA
    response: token  // The user response token provided by the reCAPTCHA client-side integration on your site.
  }).then(response => {
      console.log(JSON.stringify(response.data));
      res.send(response.data.success);
  }).catch(error => {
      res.status(500).send(false);
  });

});

router.get('/recaptcha', (req, res, next) => {
  res.send(process.env.RECAPTCHA_KEY);
});

// ------------------------------
// errors

let sendError = (res, view, title, error) => {

  var t;
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

  res.render(view, { 
    title: process.env.TITLE,
    typeform: title,
    error: parseError(error),
    message: ''
  });

};

// parse error 
let parseError = error => {
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

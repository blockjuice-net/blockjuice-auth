var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

var nJwt = require('njwt');
var secureRandom = require('secure-random');

var dotenv  = require('dotenv');
const { indexOf } = require('lodash');
dotenv.config();

const FIREBASE_EMAIL_VERIFY = 'http://localhost:' + process.env.PORT + '/auth/check';
const FIREBASE_RESET_PWD = 'http://localhost:' + process.env.PORT + '/signin';

var firebase;
var firebase_admin;

// -------------------------------------------------------------------------------
var passwordValidator = require('password-validator');
// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                                  // Minimum length 8
.is().max(20)                                                 // Maximum length 100
.has().uppercase()                                            // Must have uppercase letters
.has().lowercase()                                            // Must have lowercase letters
.has().digits(2)                                              // Must have at least 2 digits
.has().symbols(1)                                              // Must have simbols
.has().not().spaces()                                         // Should not have spaces
.is().not().oneOf([
  'Passw0rd', 
  'Password123', 
  'Password!'
]);  // Blacklist these values
// -------------------------------------------------------------------------------

router.use(function (req, res, next) {
  firebase_admin = req.app.locals.firebase_admin;
  firebase = req.app.locals.firebase;
  next();
});

router.post('/password', (req, res, next) => {
  var pwd = req.body.password;
  log('info', 'Password receveid to check: ' + pwd);
  var isValid = schema.validate(pwd);
  log('info', 'Password receveid valid: ' + isValid);
  res.send(isValid);
});

router.get('/keys', (req, res, next) => {
  var keys = req.app.locals.firebase.createKeys();
  log('info', 'Keys: ' + JSON.stringify(keys));
  res.json(keys);
});

router.post('/profile', (req, res, next) => {
  
  var displayname = req.body.displayname;
  var uid = req.body.uid;

  var data = {
      displayName: displayname
  };

  firebase_admin.auth().updateUser(uid, data).then(user => {
    
    log('success','UPDATED User: ' + JSON.stringify(user.toJSON()));
      
    res.render('dashboard', { 
      title: process.env.TITLE,
      user: user.toJSON()
    });

  }).catch(error => {
    renderError(res, 'signin', error);
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
    renderError(res, 'signin', error);
  });

});

router.post('/token', (req, res, next) => {

  var payload = req.body.payload;
  var token = getToken(payload);
  log('info', 'Token: ' + JSON.stringify(payload))
  res.json(token);
  
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
    
    log('success','CHECKED EMAIL User: ' + JSON.stringify(user));
      
    res.render('dashboard', { 
      title: process.env.TITLE,
      user: result.user
    });

  }).catch(error => {
    renderError(res, 'signup', error);
  });

});

// login with username and password 
router.post('/signin', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
    log('success','User: ' + JSON.stringify(user));
    res.render('dashboard', { 
      title: process.env.TITLE,
      user: result.user
    });
  }).catch(error => {
    renderError(res, 'signin', error);
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
  
    firebase.auth().sendSignInLinkToEmail(email, options).then(() => {
      
      // Verification email sent.
      res.render('checkemail', { 
        title: process.env.TITLE,
        message: 'Please check your email and click link to verify your account ...'
      });

    }).catch(error => {
      renderError(res, 'signup', error);
    });

  }).catch(error => {
    renderError(res, 'signup', error);
  });

});

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

// ----------------------------------------------------
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

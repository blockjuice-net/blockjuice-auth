var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');

var dotenv  = require('dotenv');
const { indexOf } = require('lodash');
dotenv.config();

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

router.post('/resetpassword', (req, res, next) => {
 
  var email = req.body.email;

  console.log('Body ' +  JSON.stringify(req.body));

  var options = {
    url: process.env.FIREBASE_RESET_PWD,
    handleCodeInApp: true
  };

  req.app.locals.firebase.passwordReset(email, options, error => {
    
    if (error != null) {
      
      log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
      renderError(res, 'signin', req.app.locals.firebase.getError(error));

    } else {
      log('success','Reset Password OK');

      res.render('checkemail', { 
        title: process.env.TITLE,
        message: 'Please check your email and click link to reset your password ...'
      });

    }
  })

});

router.post('/token', (req, res, next) => {

  var payload = req.body.payload;
  var token = req.app.locals.firebase.getToken(payload);
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

  req.app.locals.firebase.checkMail(email, url, (error, user) => {
    if (error != null) {
      log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
      renderError(res, 'signup', req.app.locals.firebase.getError(error));
    } else {
      log('success','CHECKED EMAIL User: ' + JSON.stringify(user));
      
      res.render('dashboard', { 
        title: process.env.TITLE,
        user: user
      });

    }
  });

});

// login with username and password 
router.post('/signin', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;
  
  req.app.locals.firebase.signIn(email, password, (error, user) => {

    if (error != null) {
      log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
      renderError(res, 'signin', req.app.locals.firebase.getError(error));
    } else {
      log('success','User: ' + JSON.stringify(user));
      res.render('dashboard', { 
        title: process.env.TITLE,
        user: user
      });
    }
         
  });

});

// registration new user with login and password
router.post('/signup', (req, res, next) => {
  
  var email = req.body.email;
  var password = req.body.password;

  req.app.locals.firebase.signUp(email, password, (error, user) => {

    if (error != null) {
      log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
      renderError(res, 'signup', req.app.locals.firebase.getError(error));
    } else {

      var options = {
        url: process.env.FIREBASE_EMAIL_VERIFY + '?email=' + email,
        handleCodeInApp: true
      };
    
      log('info', 'Options: ' + JSON.stringify(options));
    
      req.app.locals.firebase.verifyMail(email, options, error => {
        if (error != null) {
          log('error','Code: ' + error.errorCode + ' Message: ' + error.errorMessage);
          renderError(res, 'signup', req.app.locals.firebase.getError(error));
        } else {
          res.render('checkemail', { 
            title: process.env.TITLE,
            message: 'Please check your email and click link to verify your account ...'
          });
        }
      });
    }
         
  });

});

router.get('/logout', (req, res, next) => {

  req.app.locals.firebase.logOut(error => {
    res.redirect('/');
  });

});

let renderError = (res, view, error) => {

  var t;

  if (view == 'signup') {
    t = 'Sign Up';
  } else if (view == 'signin') {
    t = 'Sign In';
  };

  res.render(view, { 
    title: process.env.TITLE,
    typeform: t,
    error: error,
    message: ''
  });

}

module.exports = router;

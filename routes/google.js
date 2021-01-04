var express   = require('express');
var router    = express.Router();
const log     = require('logbootstrap');
const errors  = require('../errors');

var dotenv  = require('dotenv');
dotenv.config();

var provider;

var auth;

router.use(function (req, res, next) {
  
    auth = req.app.locals.firebase.auth();
    provider = new req.app.locals.firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    // firebase.auth().languageCode = 'it';
    // To apply the default browser preference instead of explicitly setting it.
    auth.useDeviceLanguage();
  
    next();
});

router.get('/', (req, res, next) => {

  log('info', 'LogIn with provider Google ');

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
    errors.render(res, 'signup', error);
  });

});

module.exports = router;
